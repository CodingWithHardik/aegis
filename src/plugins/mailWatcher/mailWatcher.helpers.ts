import { gmail_v1 } from "googleapis"
import { code } from "./mailWatcher.worker";

type Part = gmail_v1.Schema$MessagePart

export type Headers = Record<string, string>

export const headersOf = (payload?: Part): Headers => 
    Object.fromEntries((payload?.headers ?? []).map((header) => [(header.name ?? "").toLowerCase(), header.value ?? ""]));

export const localPart = (id: string): string => id.trim().replace(/^<|>$/g, "").split("@")[0]

export const idsFromHeader = (v?: string): string[] => (v?.match(/<[^>]+>/g) ?? []).map(localPart)

export const emailFrom = (from: string) => (from?.match(/<([^>]+)>/)?.[1] ?? from).trim().toLowerCase()

export function isAutomated(h: Headers, fromEmail: string): boolean {
    const auto = h["auto-submitted"];
    if (auto && auto.toLowerCase() !== "no") return true;
    if (h["x-autoreply"] || h["x-autorespond"]) return true;
    if (/^(bulk|junk|auto_reply)$/.test(h["precedence"] ?? "")) return true;
    return /^(mailer-daemon|postmaster)@/i.test(fromEmail);
}

export const subjectTicketId = (subject?: string): string | null =>
    subject?.match(/\[TICKET\s*-\s*([A-Za-z]+\d+)\]/)?.[1].toUpperCase() ?? null;

const decode = (data?: string | null): string => (data ? Buffer.from(data, "base64url").toString("utf-8") : "");

function findBody(part: Part | undefined, mine: string): string | null {
    if (!part) return null;
    if (part.mimeType === mine && part.body?.data) return decode(part.body.data);
    for (const p of part.parts ?? []) {
        const r = findBody(p, mine);
        if (r) return r;
    }
    return null;
}

export function htmlToText(html: string): string {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|tr|li|h\d)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
}

const quote_starts: RegExp[] = [
    /^>/m, 
    /^On [\s\S]{0,300}?wrote:/m,
    /^-{2,}\s*Original Message\s*-{2,}/im,
    /^From:\s.+\r?\n(?:Sent|Date):/im,
    /^_{10,}\s*$/m,
]

export function stripQuoted(text: string): string {
    const newtext = text.replace(/\r\n/g, "\n")
    const cuts = quote_starts.map((re) => newtext.search(re)).filter((i) => i >= 0);
    const kept = (cuts.length ? newtext.slice(0, Math.min(...cuts)) : newtext).trim();
    return kept || newtext.trim()
}

export function getBodyText(payload?: Part, snippet?: string | null): string {
    const plain = findBody(payload, "text/plain");
    if (plain?.trim()) return stripQuoted(plain).slice(0, 20000);
    const html = findBody(payload, "text/html")
    if (html?.trim()) {
        const withoutQuote = html.split(/<div class="gmail_quote/i)[0];
        return stripQuoted(htmlToText(withoutQuote)).slice(0, 20000)
    }
    return (snippet ?? "").trim()
}

export const isAuthProblem = (e: any): boolean => {
    const msg = String(e?.response?.data?.error ?? e?.message ?? "");
    if (msg.includes("invalid_grant")) return true;
    return code(e) === 403 && /insufficient|scope/i.test(String(e?.message ?? ""))
}