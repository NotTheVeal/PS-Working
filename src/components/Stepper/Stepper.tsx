import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export interface StepperStep {
  label: string
  description?: string
}

export interface StepperProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof stepperVariants> {
  steps: StepperStep[]
  currentStep: number
  variant?: 'default' | 'compact'
}

const stepperVariants = cva('flex w-full items-start', {
  variants: {
    variant: {
      default: 'gap-0',
      compact: 'gap-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type StepState = 'completed' | 'current' | 'upcoming'

function getStepState(index: number, currentStep: number): StepState {
  if (index < currentStep) return 'completed'
  if (index === currentStep) return 'current'
  return 'upcoming'
}

const CheckIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

interface StepCircleProps {
  state: StepState
  stepNumber: number
  variant: 'default' | 'compact'
}

const StepCircle = ({ state, stepNumber, variant }: StepCircleProps) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'h-3 w-3 rounded-full flex-shrink-0',
          state === 'completed' && 'bg-[#1a56b0]',
          state === 'current' && 'bg-[#d97757]',
          state === 'upcoming' && 'bg-[#e0ddd6]'
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold',
        state === 'completed' && 'bg-[#1a56b0] text-white',
        state === 'current' &&
          'border-2 border-[#d97757] bg-white text-[#d97757]',
        state === 'upcoming' && 'border-2 border-[#e0ddd6] bg-white text-[#6b6b6b]'
      )}
    >
      {state === 'completed' ? <CheckIcon /> : <span>{stepNumber}</span>}
    </div>
  )
}

interface ConnectorProps {
  completed: boolean
}

const Connector = ({ completed }: ConnectorProps) => (
  <div
    aria-hidden="true"
    className={cn(
      'mt-4 h-0.5 flex-1',
      completed ? 'bg-[#1a56b0]' : 'bg-[#e0ddd6]'
    )}
  />
)

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, currentStep, variant = 'default', className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        role="list"
        aria-label="Progress"
        className={cn(stepperVariants({ variant }), className)}
        {...props}
      >
        {steps.map((step, index) => {
          const state = getStepState(index, currentStep)
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <li
                role="listitem"
                aria-current={state === 'current' ? 'step' : undefined}
                className={cn(
                  'flex',
                  variant === 'compact'
                    ? 'items-center'
                    : 'flex-col items-center'
                )}
              >
                {variant === 'compact' ? (
                  <StepCircle
                    state={state}
                    stepNumber={index + 1}
                    variant="compact"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <StepCircle
                      state={state}
                      stepNumber={index + 1}
                      variant="default"
                    />
                    <div className="mt-2 flex flex-col items-center gap-0.5 text-center max-w-[100px]">
                      <span
                        className={cn(
                          'text-xs font-semibold leading-tight',
                          state === 'current'
                            ? 'text-[#d97757]'
                            : state === 'completed'
                            ? 'text-[#1a56b0]'
                            : 'text-[#6b6b6b]'
                        )}
                      >
                        {step.label}
                      </span>
                      {step.description && (
                        <span className="text-[11px] text-gray-500 leading-tight">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>

              {!isLast && (
                <Connector completed={index < currentStep} />
              )}
            </React.Fragment>
          )
        })}
      </ol>
    )
  }
)

Stepper.displayName = 'Stepper'
