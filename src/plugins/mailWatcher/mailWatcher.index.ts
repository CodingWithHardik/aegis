import Elysia from "elysia";
import { mailWatcher, MailWatcherOptions } from "./mailWatcher.worker";

export function MailWatcherPlugin(option: MailWatcherOptions){
    const watcher = new mailWatcher(option)

    return new Elysia({ name: "mail_watcher" })
        .decorate("mailWatcher", watcher)
        .onStart(() => watcher.start())
        .onStop(() => watcher.stop()) 
}