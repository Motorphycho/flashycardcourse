import * as React from "react"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        type="submit"
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
SubmitButton.displayName = "SubmitButton"

export { SubmitButton }
