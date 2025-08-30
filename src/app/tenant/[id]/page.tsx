"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Home,
  IndianRupee,
  Phone,
  Hash,
  ArrowLeft,
  Calendar,
  Receipt,
  Plus,
  AlertCircle,
  CheckCircle,
  Trash2,
  Ban,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

// NOTE: The `useParams`, `Link`, and `useToast` imports have been removed
// to resolve the compilation errors and ensure the component is self-contained.
// A simple state-based message display is used instead of a toast.

interface Tenant {
  _id: string;
  name: string;
  mobile_number: string;
  rent_amount: number;
  sr_no: number;
}

interface RentCollection {
  _id: string;
  receipt_no: string;
  start_date: string;
  end_date: string;
  total_months: number;
  total_rent: number;
  collection_date: string;
}

interface RentFormContentProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    receipt_no: string;
    start_date: string;
    end_date: string;
    collection_date: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalMonths: number;
  totalRent: number;
}

const RentFormContent: React.FC<RentFormContentProps> = ({
  onSubmit,
  formData,
  onFormChange,
  totalMonths,
  totalRent,
}) => (
  <form onSubmit={onSubmit}>
    <div className="grid gap-6 py-4">
      <div className="space-y-2">
        <Label
          htmlFor="collection_date"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Calendar className="h-4 w-4 text-purple-600" />
          Collection Date - दिनांक
        </Label>
        <Input
          id="collection_date"
          name="collection_date"
          type="date"
          value={formData.collection_date}
          onChange={onFormChange}
          className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="receipt_no"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Receipt className="h-4 w-4 text-blue-600" />
          Receipt No. - पावती क्र.
        </Label>
        <Input
          id="receipt_no"
          name="receipt_no"
          value={formData.receipt_no}
          onChange={onFormChange}
          className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="start_date"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Calendar className="h-4 w-4 text-green-600" />
          Start Date (YYYY-MM) - प्रारंभ
        </Label>
        <Input
          id="start_date"
          name="start_date"
          type="month"
          value={formData.start_date}
          onChange={onFormChange}
          className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="end_date"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Calendar className="h-4 w-4 text-orange-600" />
          End Date (YYYY-MM) - समाप्त
        </Label>
        <Input
          id="end_date"
          name="end_date"
          type="month"
          value={formData.end_date}
          onChange={onFormChange}
          className="border-2 border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 transition-all duration-200"
          required
        />
      </div>

      {/* MODIFIED: Always show total months and rent, with placeholders */}
      <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            Total Months - महिने
          </p>
          <p className="text-lg font-bold text-gray-800">
            {totalMonths > 0 ? totalMonths : "--"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-blue-600" />
            Total Rent - भाडे
          </p>
          <p className="text-lg font-bold text-gray-800">
            {totalRent > 0 ? `₹${totalRent.toFixed(2)}` : "--"}
          </p>
        </div>
      </div>
    </div>
    <DialogFooter className="mt-4">
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <IndianRupee className="h-4 w-4 mr-2" />
        Submit Payment
      </Button>
    </DialogFooter>
  </form>
);

export default function TenantDetailsPage() {
  const [id, setId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [rentCollections, setRentCollections] = useState<RentCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rentToDeleteId, setRentToDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [calculatedTotalMonths, setCalculatedTotalMonths] = useState(0);
  const [calculatedTotalRent, setCalculatedTotalRent] = useState(0);
  const [formData, setFormData] = useState({
    receipt_no: "",
    start_date: "",
    end_date: "",
    collection_date: "",
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get the tenant ID from the URL pathname as a workaround for the sandbox environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const tenantId = pathParts[pathParts.length - 1];
      setId(tenantId);
    }
  }, []);

  const fetchTenantData = async () => {
    if (!id) return;
    try {
      const tenantRes = await fetch(`/api/tenants/${id}`);
      if (!tenantRes.ok) throw new Error("Failed to fetch tenant data");
      const tenantData = await tenantRes.json();
      setTenant(tenantData.data);

      const rentRes = await fetch(`/api/rent/${id}`);
      if (rentRes.status === 404) {
        setRentCollections([]);
      } else if (!rentRes.ok) {
        throw new Error("Failed to fetch rent collections");
      } else {
        const rentData = await rentRes.json();
        setRentCollections(rentData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTenantData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sortedRentCollections = useMemo(() => {
    const sortableItems = [...rentCollections];
    sortableItems.sort((a, b) => {
      const dateA = new Date(a.collection_date).getTime();
      const dateB = new Date(b.collection_date).getTime();
      if (dateA < dateB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (dateA > dateB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [rentCollections, sortDirection]);

  const handleSort = () => {
    setSortDirection((currentDirection) =>
      currentDirection === "asc" ? "desc" : "asc"
    );
  };

  useEffect(() => {
    const calculateRent = () => {
      if (tenant && formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        if (startDate <= endDate) {
          const diffInMonths =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

          setCalculatedTotalMonths(diffInMonths + 1);
          setCalculatedTotalRent((diffInMonths + 1) * tenant.rent_amount);
        } else {
          setCalculatedTotalMonths(0);
          setCalculatedTotalRent(0);
        }
      } else {
        setCalculatedTotalMonths(0);
        setCalculatedTotalRent(0);
      }
    };
    calculateRent();
  }, [formData.start_date, formData.end_date, tenant]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/rent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tenant_id: id,
          total_months: calculatedTotalMonths,
          total_rent: calculatedTotalRent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add rent collection");
      }

      fetchTenantData();
      setIsModalOpen(false);
      setMessage({ type: "success", text: "Rent payment added successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to add rent collection: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
    }
  };

  const handleDelete = (rentId: string) => {
    setRentToDeleteId(rentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!rentToDeleteId) return;

    try {
      const response = await fetch(`/api/rent/${rentToDeleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete rent collection");
      }

      // Refresh the data after successful deletion
      fetchTenantData();
      setIsDeleteModalOpen(false);
      setRentToDeleteId(null);
      setMessage({
        type: "success",
        text: "Rent payment deleted successfully.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to delete rent collection: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">
            Loading tenant data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">
            An error occurred: {error || "Tenant not found."}.
          </p>
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {message && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md flex items-center gap-2 z-50 ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Home className="h-10 w-10 text-blue-600" />
            Tenant Details - भाडेकरू माहिती
          </h1>
          <Link href="/" passHref>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl px-4 py-2 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm mt-8 p-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Users className="h-6 w-6" />
            Tenant Information - भाडेकरू माहिती
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-600" />
              Serial No. - अनुक्रमांक.
            </p>
            <p className="text-lg font-bold text-gray-800">#{tenant.sr_no}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Full Name - नाव
            </p>
            <p className="text-lg font-bold text-gray-800">{tenant.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-purple-600" />
              Mobile Number - मोबाईल
            </p>
            <p className="text-lg font-bold text-gray-800">
              {tenant.mobile_number}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-orange-600" />
              Rent Amount - भाडे
            </p>
            <p className="text-lg font-bold text-gray-800">
              ₹{tenant.rent_amount}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm mt-8 p-0 pb-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <IndianRupee className="h-6 w-6" />
            Rent Collection List - भाडे पावती सूची
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
              <Button className="flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4" />
                Rent Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl border-0 p-0">
              <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                  <IndianRupee className="h-5 w-5" />
                  Add Rent Collection
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <RentFormContent
                  onSubmit={handleFormSubmit}
                  formData={formData}
                  onFormChange={handleFormChange}
                  totalMonths={calculatedTotalMonths}
                  totalRent={calculatedTotalRent}
                />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          {rentCollections.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-6">
                No rent collection records found for this tenant.
              </p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
                  <Button className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Rent Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl border-0 p-0">
                  <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <DialogTitle className="text-xl font-bold flex items-center gap-3">
                      <IndianRupee className="h-5 w-5" />
                      Add Rent Collection
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-6">
                    <RentFormContent
                      onSubmit={handleFormSubmit}
                      formData={formData}
                      onFormChange={handleFormChange}
                      totalMonths={calculatedTotalMonths}
                      totalRent={calculatedTotalRent}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
                  <TableHead
                    className="text-center font-semibold text-gray-700 cursor-pointer"
                    onClick={handleSort}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Collection Date - दिनांक
                      {sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px] text-center font-semibold text-gray-700">
                    Receipt No. - पावती क्र.
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Period - कालावधी
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Total Months - महिने
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Total Rent - भाडे
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRentCollections.map((rent, index) => (
                  <TableRow
                    key={rent._id}
                    className={`hover:bg-gradient-to-r hover:from-green-50 hover:to-cyan-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <TableCell className="text-center text-gray-600">
                      {new Date(rent.collection_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {rent.receipt_no}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      {new Date(rent.start_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}{" "}
                      to{" "}
                      {new Date(rent.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-green-600">
                      {rent.total_months}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      ₹{rent.total_rent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(rent._id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-all duration-300 transform hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 -m-6 mb-6 rounded-t-2xl">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-lg text-gray-700">
              Are you sure you want to delete this rent payment? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter className="mt-4 flex flex-row-reverse gap-4">
            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl px-6 py-3 transition-all duration-300"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
