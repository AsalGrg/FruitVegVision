export const metadata = {
  title: 'Real-time Food Detection',
  description: 'YOLO object detection with calorie estimation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
