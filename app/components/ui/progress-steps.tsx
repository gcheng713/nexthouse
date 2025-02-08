import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function ProgressSteps({ currentStep, steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                index + 1 <= currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-sm transition-all duration-200",
                index + 1 <= currentStep
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-[2px] -z-10">
          <div className="w-full h-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
