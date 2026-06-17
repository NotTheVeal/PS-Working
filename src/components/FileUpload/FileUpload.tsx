import * as React from 'react'
import { cn } from '@/lib/cn'

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesChange?: (files: File[]) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
}

interface FileEntry {
  file: File
  sizeError: boolean
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      onFilesChange,
      label,
      hint,
      error,
      disabled,
      id,
    },
    ref
  ) => {
    const inputId = id ?? React.useId()
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`
    const dropzoneId = `${inputId}-dropzone`

    const [entries, setEntries] = React.useState<FileEntry[]>([])
    const [dragActive, setDragActive] = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement>(null)

    const addFiles = React.useCallback(
      (incoming: File[]) => {
        const newEntries: FileEntry[] = incoming.map((file) => ({
          file,
          sizeError: maxSize != null && file.size > maxSize,
        }))

        setEntries((prev) => {
          const merged = multiple ? [...prev, ...newEntries] : newEntries
          // deduplicate by name+size
          const seen = new Set<string>()
          const deduped = merged.filter((e) => {
            const key = `${e.file.name}-${e.file.size}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          const validFiles = deduped
            .filter((e) => !e.sizeError)
            .map((e) => e.file)
          onFilesChange?.(validFiles)
          return deduped
        })
      },
      [maxSize, multiple, onFilesChange]
    )

    const removeEntry = (index: number) => {
      setEntries((prev) => {
        const next = prev.filter((_, i) => i !== index)
        onFilesChange?.(next.filter((e) => !e.sizeError).map((e) => e.file))
        return next
      })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files))
        // Reset so same file can be re-selected
        e.target.value = ''
      }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled) setDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragActive(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragActive(false)
      if (disabled) return
      const dropped = Array.from(e.dataTransfer.files)
      if (!multiple && dropped.length > 0) {
        addFiles([dropped[0]])
      } else {
        addFiles(dropped)
      }
    }

    const handleZoneClick = () => {
      if (!disabled) inputRef.current?.click()
    }

    const handleZoneKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (!disabled) inputRef.current?.click()
      }
    }

    const describedBy = [
      error ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div ref={ref} className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-[#1a1a1a] leading-none"
          >
            {label}
          </label>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />

        {/* Drop zone */}
        <div
          id={dropzoneId}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label={label ? `Upload ${label}` : 'Upload files'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleZoneClick}
          onKeyDown={handleZoneKeyDown}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8',
            'cursor-pointer transition-colors duration-150 select-none',
            dragActive
              ? 'border-[#1a56b0] bg-blue-50'
              : error
              ? 'border-[#e53e3e] bg-white'
              : 'border-[#e0ddd6] bg-white hover:border-[#1a56b0] hover:bg-[#f0ede8]',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          {/* Upload icon */}
          <svg
            className={cn(
              'h-8 w-8',
              dragActive ? 'text-[#1a56b0]' : 'text-[#6b6b6b]'
            )}
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-sm font-medium text-[#1a56b0]">
              Click to upload
            </span>
            <span className="text-xs text-[#6b6b6b]">
              or drag and drop
              {accept && ` · ${accept}`}
              {maxSize && ` · Max ${formatBytes(maxSize)}`}
            </span>
          </div>
        </div>

        {/* File list */}
        {entries.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1" aria-label="Selected files">
            {entries.map((entry, index) => (
              <li
                key={`${entry.file.name}-${entry.file.size}-${index}`}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-3 py-2 text-sm',
                  entry.sizeError
                    ? 'border-[#e53e3e] bg-red-50'
                    : 'border-[#e0ddd6] bg-white'
                )}
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-medium text-[#1a1a1a]">
                    {entry.file.name}
                  </span>
                  <span className="text-xs text-[#6b6b6b]">
                    {formatBytes(entry.file.size)}
                  </span>
                  {entry.sizeError && (
                    <span className="text-xs text-[#e53e3e]" role="alert">
                      File exceeds maximum size of {formatBytes(maxSize ?? 0)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${entry.file.name}`}
                  onClick={() => removeEntry(index)}
                  className={cn(
                    'ml-3 flex-shrink-0 rounded p-1 transition-colors',
                    'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f0ede8]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1'
                  )}
                >
                  <svg
                    className="h-4 w-4"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p id={errorId} className="text-[12px] text-[#e53e3e] leading-[1.4]" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-[12px] text-[#6b6b6b] leading-[1.4]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
