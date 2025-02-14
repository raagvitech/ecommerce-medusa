import { Text } from "@medusajs/ui"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className=" items-center justify-center rounded-xl bg-black/10 px-4 py-2 text-black-0 hover:bg-black/5 transition"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-sm font-normal">{children}</Text>
    </LocalizedClientLink>
  )
}

export default InteractiveLink
