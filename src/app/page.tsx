"use client";

import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  Pencil,
  Plus,
  Users,
  Home,
  IndianRupee,
  Phone,
  Hash,
  CheckCircle,
  AlertCircle,
  Zap,
  MoreVertical,
  ArrowRight,
  ArrowBigRightDash,
  ArrowBigDownDash,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// This is a placeholder for your API URL
const API_URL = "http://localhost:3000/api";

interface Tenant {
  _id: string;
  name: string;
  mobile_number: string;
  rent_amount: number;
  sr_no: number;
}

export default function TenantDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    rent_amount: "",
    sr_no: "",
  } as {
    name: string;
    mobile_number: string;
    rent_amount: string;
    sr_no: string | number;
  });

  const fetchTenants = async () => {
    try {
      const response = await fetch(`${API_URL}/tenants`);
      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }
      const data = await response.json();
      // Sort tenants by sr_no
      const sortedTenants = data.data.sort(
        (a: Tenant, b: Tenant) => a.sr_no - b.sr_no
      );
      setTenants(sortedTenants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch tenants on component mount
  useEffect(() => {
    fetchTenants();
  }, []);

  // Effect to automatically hide the message after a few seconds
  useEffect(() => {
    if (message) {
      // Set a timer to clear the message after 3000ms (3 seconds)
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      // Clean up the timer when the component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async () => {
    if (!deletingTenant) return;

    try {
      const response = await fetch(`${API_URL}/tenants/${deletingTenant._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete tenant");
      }

      setTenants(tenants.filter((tenant) => tenant._id !== deletingTenant._id));
      setMessage({ type: "success", text: "Tenant deleted successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to delete tenant: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
    } finally {
      setDeletingTenant(null);
    }
  };

  const handleAdd = () => {
    setCurrentTenant(null);
    const newSrNo =
      tenants.length > 0 ? Math.max(...tenants.map((t) => t.sr_no)) + 1 : 1;
    setFormData({
      name: "",
      mobile_number: "",
      rent_amount: "",
      sr_no: newSrNo,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setFormData({
      name: tenant.name,
      mobile_number: tenant.mobile_number,
      rent_amount: tenant.rent_amount,
      sr_no: tenant.sr_no,
    });
    setIsModalOpen(true);
  };

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
      let response;
      if (currentTenant) {
        // Edit existing tenant
        response = await fetch(`${API_URL}/tenants/${currentTenant._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            rent_amount: parseFloat(formData.rent_amount),
            sr_no: parseInt(formData.sr_no, 10),
          }),
        });
      } else {
        // Add new tenant
        response = await fetch(`${API_URL}/tenants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            rent_amount: parseFloat(formData.rent_amount),
            sr_no: parseInt(formData.sr_no, 10),
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${currentTenant ? "update" : "add"} tenant`
        );
      }

      // Refresh the list and close the modal
      fetchTenants();
      setIsModalOpen(false);
      setMessage({
        type: "success",
        text: `Tenant ${currentTenant ? "updated" : "added"} successfully.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: `Failed to ${currentTenant ? "update" : "add"} tenant: ${
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
            Loading tenants...
          </p>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Connection Error
          </h2>
          <p className="text-red-600 mb-4">
            An error occurred: {error}. Please check your API server.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl px-6 py-3"
          >
            <Zap className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Home className="h-10 w-10 text-blue-600" />
          Ghar Bhada - Gondekar House
        </h1>
        <div className="flex items-center gap-3">
          <ArrowBigDownDash className="h-7 w-7 text-sky-600 ml-1.5" />
          <h2 className="text-gray-600 text-xl">घर भाड़े - गोंडेंकर हाउस</h2>
        </div>
      </div>

      <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm p-0 pb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Users className="h-6 w-6" />
            Tenant List - भाडेकरू
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl border-0">
              <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-6 mb-6 rounded-t-2xl">
                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  {currentTenant ? "Edit Tenant" : "Add Tenant"}
                </DialogTitle>
                <DialogDescription className="text-blue-100">
                  {currentTenant
                    ? "Update the tenant's information."
                    : "Add a new tenant to the list."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit}>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sr_no"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4 text-blue-600" />
                      Serial No. - अनुक्रमांक.
                    </Label>
                    <Input
                      id="sr_no"
                      name="sr_no"
                      type="number"
                      value={formData.sr_no}
                      onChange={handleFormChange}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200"
                      placeholder="Enter serial number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-green-600" />
                      Full Name - नाव
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 transition-all duration-200"
                      placeholder="Enter tenant's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile_number"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4 text-purple-600" />
                      Mobile Number - मोबाईल
                    </Label>
                    <Input
                      id="mobile_number"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleFormChange}
                      className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 transition-all duration-200"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="rent_amount"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <IndianRupee className="h-4 w-4 text-orange-600" />
                      Rent Amount - भाडे
                    </Label>
                    <Input
                      id="rent_amount"
                      name="rent_amount"
                      type="number"
                      value={formData.rent_amount}
                      onChange={handleFormChange}
                      className="border-2 border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 transition-all duration-200"
                      placeholder="Enter rent amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {currentTenant ? "Update Tenant" : "Add Tenant"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          {tenants.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Tenants Found
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first tenant to get started with managing your rental
                properties.
              </p>
              <Button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Tenant
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
                  <TableHead className="w-[80px] font-semibold text-gray-700 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Hash className="h-4 w-4 text-blue-600" />
                      Sr. No. - अ.क्र.
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                      Name - नाव
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Phone className="h-4 w-4 text-purple-600" />
                      Mobile Number - मोबाईल
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    <div className="flex items-center gap-2 justify-end">
                      <IndianRupee className="h-4 w-4 text-orange-600" />
                      Rent Amount - भाडे
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant, index) => (
                  <TableRow
                    key={tenant._id}
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <TableCell className="font-bold text-blue-600 text-center">
                      #{tenant.sr_no}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800 text-center">
                      {tenant.name}
                    </TableCell>
                    <TableCell className="text-purple-600 font-medium text-center">
                      {tenant.mobile_number}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600 ">
                      ₹{tenant.rent_amount}
                    </TableCell>
                    <TableCell className="text-center flex justify-center items-center gap-2">
                      <a href={`/tenant/${tenant._id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:text-indigo-700 transition-all duration-200 hover:scale-110"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl shadow-xl border-0 p-2">
                          <DropdownMenuItem
                            onClick={() => handleEdit(tenant)}
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => setDeletingTenant(tenant)}
                                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl bg-white shadow-2xl border-0">
                              <AlertDialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 -m-6 mb-6 rounded-t-2xl">
                                <AlertDialogTitle className="text-xl font-bold flex items-center gap-3">
                                  <Trash2 className="h-5 w-5" />
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-red-100">
                                  This action cannot be undone. This will
                                  permanently delete the tenant and all
                                  associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel className="rounded-xl border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 transition-all duration-200">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Tenant
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {message && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 transform ${
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
    </main>
  );
}
