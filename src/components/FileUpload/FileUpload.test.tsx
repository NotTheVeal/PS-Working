import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FileUpload } from './FileUpload'

function makeFile(name: string, size = 1024, type = 'text/plain'): File {
  const file = new File(['x'.repeat(size)], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('FileUpload', () => {
  it('renders the drop zone', () => {
    render(<FileUpload />)
    expect(screen.getByRole('button', { name: /upload files/i })).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<FileUpload label="Attachment" />)
    expect(screen.getByText('Attachment')).toBeInTheDocument()
  })

  it('uses label in drop zone aria-label', () => {
    render(<FileUpload label="Invoice" />)
    expect(screen.getByRole('button', { name: /upload invoice/i })).toBeInTheDocument()
  })

  it('shows hint text', () => {
    render(<FileUpload hint="PDFs only" />)
    expect(screen.getByText('PDFs only')).toBeInTheDocument()
  })

  it('shows error text and sets aria-invalid on input', () => {
    render(<FileUpload error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
    // The hidden input should have aria-invalid
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('adds files via input change and calls onFilesChange', async () => {
    const onFilesChange = vi.fn()
    const user = userEvent.setup()
    render(<FileUpload onFilesChange={onFilesChange} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = makeFile('test.txt', 500)
    await user.upload(input, file)
    expect(screen.getByText('test.txt')).toBeInTheDocument()
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('shows file size in file list', async () => {
    const user = userEvent.setup()
    render(<FileUpload />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = makeFile('doc.pdf', 2048)
    await user.upload(input, file)
    expect(screen.getByText(/2(\.\d)? KB/)).toBeInTheDocument()
  })

  it('shows size error for file exceeding maxSize', async () => {
    const user = userEvent.setup()
    render(<FileUpload maxSize={1000} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const bigFile = makeFile('big.jpg', 5000)
    await user.upload(input, bigFile)
    expect(screen.getAllByRole('alert').some(el => /exceeds maximum/i.test(el.textContent ?? ''))).toBe(true)
  })

  it('does not include oversized files in onFilesChange', async () => {
    const onFilesChange = vi.fn()
    const user = userEvent.setup()
    render(<FileUpload maxSize={1000} onFilesChange={onFilesChange} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const bigFile = makeFile('big.jpg', 5000)
    await user.upload(input, bigFile)
    expect(onFilesChange).toHaveBeenCalledWith([])
  })

  it('removes a file when remove button clicked', async () => {
    const onFilesChange = vi.fn()
    const user = userEvent.setup()
    render(<FileUpload onFilesChange={onFilesChange} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = makeFile('removeme.txt', 100)
    await user.upload(input, file)
    expect(screen.getByText('removeme.txt')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /remove removeme\.txt/i }))
    expect(screen.queryByText('removeme.txt')).not.toBeInTheDocument()
    expect(onFilesChange).toHaveBeenLastCalledWith([])
  })

  it('accepts drop event and adds files', () => {
    const onFilesChange = vi.fn()
    render(<FileUpload onFilesChange={onFilesChange} />)
    const dropzone = screen.getByRole('button', { name: /upload files/i })
    const file = makeFile('dropped.txt', 200)
    fireEvent.dragOver(dropzone, {
      dataTransfer: { files: [file] },
    })
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    })
    expect(screen.getByText('dropped.txt')).toBeInTheDocument()
  })

  it('does not open picker when disabled', async () => {
    const user = userEvent.setup()
    render(<FileUpload disabled />)
    const dropzone = screen.getByRole('button', { name: /upload files/i })
    expect(dropzone).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows multiple files when multiple=true', async () => {
    const user = userEvent.setup()
    render(<FileUpload multiple />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, [makeFile('a.txt', 100), makeFile('b.txt', 200)])
    expect(screen.getByText('a.txt')).toBeInTheDocument()
    expect(screen.getByText('b.txt')).toBeInTheDocument()
  })

  it('replaces file when multiple=false (default)', async () => {
    const user = userEvent.setup()
    render(<FileUpload multiple={false} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, makeFile('first.txt', 100))
    expect(screen.getByText('first.txt')).toBeInTheDocument()
    await user.upload(input, makeFile('second.txt', 100))
    expect(screen.queryByText('first.txt')).not.toBeInTheDocument()
    expect(screen.getByText('second.txt')).toBeInTheDocument()
  })
})
