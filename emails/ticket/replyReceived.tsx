import {
  Html,
  Body,
  Tailwind,
  Section,
  Row,
  Column,
  Img,
  Text,
} from "react-email";

export function replyReceived(
  ticketId: string,
  firstName: string,
  companyName: string,
) {
  return (
    <Html lang="en">
      <Body>
        <Tailwind>
          <Section className="py-[8px]">
            <Row>
              <Column align="center">
                <Img
                  alt="DPSKMUN LOGO"
                  height="112"
                  src="https://i.ibb.co/4ZTpQSy0/DPSKMUN.png"
                />
              </Column>
            </Row>
          </Section>
          <Section className="px-[40px] py-[24px] text-gray-500 font-['Inter',Arial,sans-serif]">
            <Row>
              <Text className="text-[16px]">Greetings {firstName}!</Text>
              <Text className="text-[16px]">We received your reply on the ticket. Our team will get back to you soon.</Text>
              <Text className="text-[16px] font-bold">Your Ticket ID: {ticketId}</Text>
              <Row>
                <Text className="text-[16px] m-0 p-0">Regards,</Text>
                <Text className="text-[16px] m-0 p-0">{companyName} Support</Text>
              </Row>
            </Row>
          </Section>
        </Tailwind>
      </Body>
    </Html>
  );
}
