import React, { useState } from 'react'
import { Button }                                      from '../Button/Button'
import { Card, CardHeader, CardBody, CardFooter }      from '../Card/Card'
import { Badge }                                       from '../Badge/Badge'
import { Banner }                                      from '../Banner/Banner'
import { Chip }                                        from '../Chip/Chip'
import { Input }                                       from '../Input/Input'
import { Select }                                      from '../Select/Select'
import { Checkbox }                                    from '../Checkbox/Checkbox'
import { Radio, RadioGroup }                           from '../Radio/Radio'
import { Textarea }                                    from '../Textarea/Textarea'
import { Spinner }                                     from '../Spinner/Spinner'
import { Modal }                                       from '../Modal/Modal'
import { ToastProvider, useToast }                     from '../Toast/Toast'
import { Tooltip }                                     from '../Tooltip/Tooltip'
import { Table, TableHead, TableBody, TableFooter as TFoot, TableRow, TableHeader, TableCell } from '../Table/Table'
import { Tabs, TabList, Tab, TabPanels, TabPanel }     from '../Tabs/Tabs'

// ─── Search icon ───────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ─── Cart items ────────────────────────────────────────────────────────────────
const cartItems = [
  { id: 'AB-7890', name: 'Ultrasound transducer probe',   qty: 1, price: 1240.00, status: 'In stock'   },
  { id: 'CD-1234', name: 'Patient monitor display',        qty: 2, price:  890.00, status: 'In stock'   },
  { id: 'EF-5678', name: 'Infusion pump motor',            qty: 1, price:  345.00, status: 'Low stock'  },
]

const statusVariant = (s: string) =>
  s === 'In stock' ? 'green' : s === 'Low stock' ? 'orange' : 'red' as const

// ─── Inner demo (needs ToastProvider in scope) ─────────────────────────────────
function DemoInner() {
  const { toast } = useToast()
  const [activeFilters, setActiveFilters] = useState<string[]>(['OEM'])
  const [shipping,      setShipping]      = useState('standard')
  const [confirmOpen,   setConfirmOpen]   = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [agreed,        setAgreed]        = useState(false)
  const [notes,         setNotes]         = useState('')
  const [search,        setSearch]        = useState('')

  const filters = ['OEM', 'Aftermarket', 'Remanufactured', 'In stock only']
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping_cost = shipping === 'overnight' ? 24.99 : shipping === 'express' ? 12.99 : 0
  const total = subtotal + shipping_cost

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setConfirmOpen(false)
      toast({ variant: 'success', title: 'Order submitted', message: 'Order #PO-12345 is being processed.' })
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#f0ede8] py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1a1a1a]">New purchase order</h1>
            <p className="text-[13px] text-[#6b6b6b] mt-0.5">Review parts and submit for approval</p>
          </div>
          <Badge variant="blue">Draft</Badge>
        </div>

        {/* Low stock banner */}
        <Banner variant="warning" title="Stock alert">
          1 item in your cart is low stock. Consider adjusting quantity or finding an alternative.
        </Banner>

        {/* Part search + filters */}
        <Card>
          <CardHeader title="Add parts" description="Search the PS catalog to add more parts." />
          <CardBody>
            <div className="flex flex-col gap-3">
              <Input
                label="Search parts"
                hideLabel
                placeholder="Search by part number or description…"
                leadingIcon={<SearchIcon />}
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search parts catalog"
              />
              <div className="flex flex-wrap gap-2">
                {filters.map(f => (
                  <Chip
                    key={f}
                    variant="filter"
                    selected={activeFilters.includes(f)}
                    onToggle={sel =>
                      setActiveFilters(prev => sel ? [...prev, f] : prev.filter(x => x !== f))
                    }
                  >
                    {f}
                  </Chip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cart + summary tabs */}
        <Card flush>
          <Tabs defaultTab="cart">
            <div className="px-5 pt-4">
              <TabList>
                <Tab tabId="cart">
                  Cart <Badge variant="blue" size="sm" className="ml-1">{cartItems.length}</Badge>
                </Tab>
                <Tab tabId="summary">Order summary</Tab>
              </TabList>
            </div>

            <TabPanels>
              {/* Cart tab */}
              <TabPanel tabId="cart" className="pt-0">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Part number</TableHeader>
                      <TableHeader>Description</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Qty</TableHeader>
                      <TableHeader>Unit price</TableHeader>
                      <TableHeader>Total</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Tooltip content="Click to view part details" placement="right">
                            <span className="font-mono text-[13px] text-[#1a56b0] cursor-pointer hover:underline">
                              {item.id}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(item.status)} size="sm">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="tabular-nums text-right">{item.qty}</TableCell>
                        <TableCell className="tabular-nums text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="tabular-nums text-right font-medium">
                          ${(item.price * item.qty).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TFoot>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right text-[#6b6b6b] text-[13px]">Subtotal</TableCell>
                      <TableCell className="tabular-nums text-right">${subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  </TFoot>
                </Table>
              </TabPanel>

              {/* Summary tab */}
              <TabPanel tabId="summary">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6b6b6b]">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6b6b6b]">Shipping</span>
                    <span className="font-medium tabular-nums">
                      {shipping_cost === 0 ? 'Free' : `$${shipping_cost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-[#e0ddd6] pt-3 flex justify-between text-[16px] font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>

        {/* Shipping + details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Shipping method */}
          <Card>
            <CardHeader title="Shipping method" />
            <CardBody>
              <RadioGroup legend="Shipping method" hideLegend className="gap-3">
                {[
                  { value: 'standard',  label: 'Standard (5–7 days)', hint: 'Free' },
                  { value: 'express',   label: 'Express (2–3 days)',   hint: '$12.99' },
                  { value: 'overnight', label: 'Overnight',            hint: '$24.99' },
                ].map(opt => (
                  <Radio
                    key={opt.value}
                    name="shipping"
                    value={opt.value}
                    label={opt.label}
                    hint={opt.hint}
                    checked={shipping === opt.value}
                    onChange={() => setShipping(opt.value)}
                  />
                ))}
              </RadioGroup>
            </CardBody>
          </Card>

          {/* Order details */}
          <Card>
            <CardHeader title="Order details" />
            <CardBody>
              <div className="flex flex-col gap-3">
                <Input label="Purchase order number" placeholder="PO-XXXXX" required />
                <Select
                  label="Ship-to location"
                  placeholder="Select facility…"
                  options={[
                    { value: 'columbus',    label: 'Columbus, OH — Main campus' },
                    { value: 'cleveland',   label: 'Cleveland, OH — North campus' },
                    { value: 'cincinnati',  label: 'Cincinnati, OH — South campus' },
                  ]}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader
            title="Order notes"
            description="Optional notes for the purchasing team."
            action={
              <Tooltip content="Notes are visible to purchasing staff only" placement="left">
                <span className="text-[#6b6b6b] cursor-default"><InfoIcon /></span>
              </Tooltip>
            }
          />
          <CardBody>
            <Textarea
              placeholder="Add any special instructions, delivery notes, or questions…"
              rows={3}
              showCount
              maxLength={500}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </CardBody>
        </Card>

        {/* Submit footer */}
        <Card>
          <CardBody>
            <Checkbox
              label="I confirm this order is accurate and authorised for submission."
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
          </CardBody>
          <CardFooter align="between">
            <Button variant="ghost">Save draft</Button>
            <div className="flex gap-2">
              <Button variant="secondary">Cancel</Button>
              <Button
                disabled={!agreed}
                onClick={() => setConfirmOpen(true)}
              >
                Review &amp; submit
              </Button>
            </div>
          </CardFooter>
        </Card>

      </div>

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Confirm order submission"
        description="This order will be sent to the purchasing team for approval."
        size="sm"
        persistent={submitting}
        footer={
          <>
            <Button variant="secondary" disabled={submitting} onClick={() => setConfirmOpen(false)}>
              Go back
            </Button>
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? (
                <><Spinner size="sm" variant="white" label="Submitting" /> Submitting…</>
              ) : 'Submit order'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6b6b6b]">Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6b6b6b]">Shipping</span>
            <span>{shipping_cost === 0 ? 'Free' : `$${shipping_cost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-[15px] font-semibold border-t border-[#e0ddd6] pt-3">
            <span>Total</span>
            <span className="tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Exported demo wrapped in ToastProvider ────────────────────────────────────
export function OrderFormDemo() {
  return (
    <ToastProvider>
      <DemoInner />
    </ToastProvider>
  )
}
