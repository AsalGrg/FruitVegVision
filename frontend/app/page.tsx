import FoodDetector from '@/components/FoodDetector'

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>
        Real-time Food Detection
      </h1>
      <FoodDetector />
    </main>
  )
}
