import {
  Html,
  Body,
  Tailwind,
  Section,
  Row,
  Column,
  Img,
  Text,
  Hr,
} from "react-email";

export function createTicketEmail(
  ticketId: string,
  name: string,
  time: string,
  message: string,
  avatar?: string,
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
                  src="https://cdn.hackclub.com/01a1fde1-2629-789b-9d06-d47070f92974/DPSKMUN.png"
                />
              </Column>
            </Row>
          </Section>
          <Section className="px-[40px] py-[24px] text-gray-500 font-['Inter',Arial,sans-serif]">
            <Row>
              <Text className="text-[16px]">Greetings!</Text>
              <Text className="text-[16px]">
                Thank you for contacting us. This is an automated message to
                confirm that we have received your request and will get back to
                you shortly with the necessary support.
              </Text>
              <Text className="text-[16px]">Your Ticket ID: {ticketId}</Text>
            </Row>
          </Section>
          <Hr className="border-t-gray-500 border-t-2" />
          <Section className="px-[40px] py-[24px] text-gray-500 font-['Inter',Arial,sans-serif]">
            <Row>
              <Column>
                <Row className="table-fixed border-collapse border-spacing-0">
                  <Column className="h-[44px] w-[44px] overflow-hidden rounded-full p-0 leading-[0px]">
                    <Img
                      src={avatar ?? "https://cdn.hackclub.com/01a1fde1-26da-7ba0-9c49-eea1e285e9cb/AVATAR.png"}
                      width="36"
                      height="36"
                      alt={avatar ? name : "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  </Column>
                  <Column className="pl-2 leading-[20px] font-medium">
                    <p className="m-0 text-black text-[14px] font-bold">
                      {name}
                    </p>
                    <p className="m-0 text-[12px]">{time}</p>
                  </Column>
                </Row>
              </Column>
            </Row>
            <Text className="text-[16px]">{message}</Text>
          </Section>
        </Tailwind>
      </Body>
    </Html>
  );
}
