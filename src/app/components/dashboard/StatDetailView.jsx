import { format } from "date-fns";
import {
  ArrowLeft,
  Search,
  History,
  FileCheck,
  Eye,
  Package,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../ui/utils";

export function StatDetailView({
  activeStatView,
  onBack,
  tableData,
  searchQuery,
  setSearchQuery,
  podFilter,
  setPodFilter,
  dateFilter,
  setDateFilter,
  showHistory,
  setShowHistory,
  onView,
}) {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {activeStatView}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed view of all {activeStatView.toLowerCase()}.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by Invoice ID, Driver, Vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-border"
          />
        </div>

        {!["Active Shipments", "Pending Dispatch", "Cancelled Invoices"].includes(activeStatView) && (
          <Select value={podFilter} onValueChange={setPodFilter}>
            <SelectTrigger className="w-[160px] h-9 bg-white border-border">
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder="POD Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All PODs</SelectItem>
              <SelectItem value="Signed">Signed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Not Generated">Not Generated</SelectItem>
            </SelectContent>
          </Select>
        )}

        {showHistory && !["Active Shipments", "Pending Dispatch", "Cancelled Invoices", "Deliveries Today"].includes(activeStatView) && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal bg-white h-9 border-border",
                    !dateFilter && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : <span>All Time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dateFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateFilter(undefined)}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear Date
              </Button>
            )}
          </div>
        )}

        {!["Active Shipments", "Pending Dispatch", "Cancelled Invoices", "Deliveries Today"].includes(activeStatView) && (
          <Button
            variant={showHistory ? "default" : "outline"}
            onClick={() => {
              setShowHistory(!showHistory);
              if (showHistory) setDateFilter(undefined);
            }}
            className={
              showHistory
                ? "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
                : "bg-white"
            }
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-[#fafbfc]">

                {/* 1. Active Shipments */}
                {activeStatView === "Active Shipments" && (
                  <>
                    <TableHead className="pl-5 w-[150px]">Invoice Number</TableHead>
                    <TableHead className="w-[200px]">Dealer & Location</TableHead>
                    <TableHead className="w-[150px]">Weight</TableHead>
                    <TableHead className="w-[160px]">Driver Info</TableHead>
                    <TableHead className="w-[160px]">Vehicle Info</TableHead>
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="w-[110px]">POD</TableHead>
                    <TableHead className="w-[60px] pr-5 text-center">View</TableHead>
                  </>
                )}

                {/* 2. Pending PODs / LRs */}
                {activeStatView === "Pending PODs / LRs" && (
                  <>
                    <TableHead className="pl-5">Invoice No</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Dispatch Date</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>POD Status</TableHead>
                    <TableHead className="pr-5">LR Status</TableHead>
                  </>
                )}

                {/* 3. Pending Dispatch */}
                {activeStatView === "Pending Dispatch" && (
                  <>
                    <TableHead className="pl-5">Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Planned Vehicle</TableHead>
                    <TableHead className="pr-5">Dispatch Status</TableHead>
                  </>
                )}

                {/* 4. Cancelled Invoices */}
                {activeStatView === "Cancelled Invoices" && (
                  <>
                    <TableHead className="pl-5">Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="pr-5">Status</TableHead>
                  </>
                )}

                {/* 5. Pending Delivery */}
                {activeStatView === "Pending Delivery" && (
                  <>
                    <TableHead className="pl-5">Invoice No</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Dispatch Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Delay (if any)</TableHead>
                  </>
                )}

                {/* 6. Deliveries Today */}
                {activeStatView === "Deliveries Today" && (
                  <>
                    <TableHead className="pl-5">Invoice No</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Delivered Time</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="pr-5">POD Received</TableHead>
                  </>
                )}

                {/* 7. Vehicles on Trip */}
                {activeStatView === "Vehicles on Trip" && (
                  <>
                    <TableHead className="pl-5">Vehicle No</TableHead>
                    <TableHead>Driver Name</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Trip Start Date</TableHead>
                    <TableHead className="pr-5">Status</TableHead>
                  </>
                )}

              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, idx) => (
                <TableRow key={idx} className="group cursor-default">
                  {activeStatView === "Cancelled Invoices" ? (
                    <>
                      <TableCell className="pl-5">
                        <span className="font-medium text-[#1d4ed8]">{item.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-600">
                          {item.originalDate ? format(new Date(item.originalDate), "dd MMM yyyy") : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-800">
                        {item.customer}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {item.location}
                      </TableCell>
                      <TableCell className="pr-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700 border border-red-200">
                          Cancelled
                        </span>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="pl-5 w-[150px]">
                        <span className="font-medium text-[#1d4ed8]">{item.id}</span>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <p className="text-sm text-foreground">Dealer Name</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.destination}</p>
                      </TableCell>
                      <TableCell className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground">450 kg</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[160px]">
                        <p className="text-sm text-foreground">{item.driver}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">+91 98765 43210</p>
                      </TableCell>
                      <TableCell className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm text-foreground">{item.vehicle}</p>
                            <Badge
                              variant="outline"
                              className="mt-0.5 text-[10px] px-1.5 py-0 rounded-sm border-blue-200 text-blue-600 bg-blue-50/60"
                            >
                              Own
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[110px]">
                        <span className="text-sm text-muted-foreground">{item.eta || "Today"}</span>
                      </TableCell>
                      <TableCell className="w-[110px]">
                        {item.podConfig ? (
                          <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${item.podConfig.className}`}>
                            {item.podConfig.icon ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {item.podConfig.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="w-[60px] pr-5 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView && onView(item)}
                          className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {tableData.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="p-0 border-none bg-slate-50/50">
                      <div className="w-full flex flex-col items-center justify-center py-10 px-6">
                        <h4 className="text-sm font-semibold text-foreground mb-1">No Data Available</h4>
                        <p className="text-sm text-muted-foreground max-w-sm text-center">
                          Please adjust your filters or select a different stat card above (e.g.,
                          "Active Shipments") to view actual data.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
export default StatDetailView;
