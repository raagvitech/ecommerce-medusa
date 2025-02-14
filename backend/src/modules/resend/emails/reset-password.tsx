import { 
  Text, 
  Column, 
  Container, 
  Heading, 
  Html, 
  Button,
  Section 
} from "@react-email/components"

type ResetPasswordEmailProps = {
  url: string
}

function ResetPasswordEmailComponent({ url }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Heading>Reset Your Password</Heading>
      <Container>
        <Section style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <Text>
            We received a request to reset your password. Click the button below to choose a new password:
          </Text>
          <Button 
            href={url}
            style={{
              backgroundColor: "#000000",
              borderRadius: "4px",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              textAlign: "center",
              display: "inline-block",
              marginTop: "16px",
              marginBottom: "16px"
            }}
          >
            Reset Password
          </Button>
          <Text style={{ fontSize: "14px", color: "#666666" }}>
            If you didn't request a password reset, you can safely ignore this email.
            The link will expire in 24 hours.
          </Text>
          <Text style={{ fontSize: "14px", color: "#666666" }}>
            For security reasons, we recommend changing your password periodically 
            and not reusing passwords across different services.
          </Text>
        </Section>
      </Container>
    </Html>
  )
}

export const resetPasswordEmail = (props: ResetPasswordEmailProps) => (
  <ResetPasswordEmailComponent {...props} />
)