
import React from "react"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl bg-white shadow border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

Card.displayName = "Card"

export const CardHeader: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={`border-b border-gray-100 px-6 py-4 ${className || ""}`}>
    {children}
  </div>
)

export const CardTitle: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <h2 className={`text-xl font-bold text-gray-900 ${className || ""}`}>
    {children}
  </h2>
)

export const CardDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <p className={`text-gray-600 text-sm ${className || ""}`}>{children}</p>
)

export const CardContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={`px-6 py-4 ${className || ""}`}>{children}</div>
)

export const CardFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={`border-t border-gray-100 px-6 py-4 ${className || ""}`}>{children}</div>
)

// Vérifiez que ce fichier existe bien et exporte Card

export default Card
