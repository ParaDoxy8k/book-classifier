import { BookClassifier } from "@/components/book-classifier";
import { Header } from "@/components/header";
import TargetCursor from "@/components/TargetCursor";
import Prism from "@/components/Prism";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0.5}
            glow={1}
          />
        </div>

        <Header />
        <main className="container mx-auto px-4 py-12 md:py-20 z-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-balance font-sans text-4xl font-bold tracking-tight md:text-6xl">
                AI Book Condition Classifier
              </h1>
              <p className="text-pretty text-lg text-muted-foreground md:text-xl">
                Upload a photo of your book and get an instant AI-powered
                condition assessment
              </p>
            </div>
            <BookClassifier />
          </div>
        </main>
        
      </div>
  );
}
