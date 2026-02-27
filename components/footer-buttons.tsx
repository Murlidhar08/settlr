"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface FooterButtonsProp {
  children: ReactNode
}


const FooterButtons = ({ children }: FooterButtonsProp) => {
  return (
    <div className="fixed bottom-20 right-5 lg:bottom-3 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto mx-auto flex justify-end gap-2 md:gap-4"
      >
        {children}
      </motion.div>
    </div>
  )
}


export { FooterButtons }
