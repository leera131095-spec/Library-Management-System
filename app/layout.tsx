import { AuthProvider } from "@/lib/auth-context"

export default function RootLayout({ children }: any) {

  return (

    <html>

      <body>

        <AuthProvider>

          {children}

        </AuthProvider>

      </body>

    </html>

  )

}
