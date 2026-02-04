import { ReactNode } from "react"

interface FooterButtonsProp {
  children: ReactNode
}

const FooterButtons = ({ children }: FooterButtonsProp) => {

  return (
    <div className="fixed bottom-23 right-5 lg:bottom-3 z-50">
      <div className="pointer-events-auto mx-auto flex justify-end gap-4">
        {children}
      </div>
    </div>
  )
}

export { FooterButtons }
