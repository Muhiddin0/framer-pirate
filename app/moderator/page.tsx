"use client";

import "../globals.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";
import { notFound, useSearchParams } from "next/navigation";

const TodoApp = () => {
  const searchParams = useSearchParams();

  const [domains, setDomains] = useState<{ [key: string]: string }>({});
  const [newDomain, setNewDomain] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editDomain, setEditDomain] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/moderator");
      setDomains(data);
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain || !newUrl) return;

    try {
      const response = await axios.post("http://localhost:3000/api/moderator", {
        domain: newDomain,
        url: newUrl,
      });
      setDomains(response.data.domains);
      setNewDomain("");
      setNewUrl("");
    } catch (error) {
      console.error("Error adding domain:", error);
    }
  };

  const handleUpdateDomain = async (domain: string) => {
    if (!editUrl) return;

    try {
      const response = await axios.put("http://localhost:3000/api/moderator", {
        domain,
        url: editUrl,
      });
      setDomains(response.data.domains);
      setEditDomain("");
      setEditUrl("");
    } catch (error) {
      console.error("Error updating domain:", error);
    }
  };

  const handleDeleteDomain = async (domain: string) => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/api/moderator",
        {
          data: { domain },
        }
      );
      setDomains(response.data.domains);
    } catch (error) {
      console.error("Error deleting domain:", error);
    }
  };

  const startEditing = (domain: string, url: string) => {
    setEditDomain(domain);
    setEditUrl(url);
  };

  if (loading && searchParams.get("password") === "QMS") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (searchParams.get("password") === "QMS")
    return (
      <div className="min-h-screen p-10 bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {/* Input Section */}
          <div className="flex gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Domain..."
              className="flex-1"
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL..."
              className="flex-1"
            />
            <Button onClick={handleAddDomain}>Add</Button>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(domains).map((domain) => (
                  <motion.tr
                    key={domain}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {editDomain === domain ? (
                        <Input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        domains[domain]
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editDomain === domain ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateDomain(domain)}
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditDomain("")}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              startEditing(domain, domains[domain])
                            }
                            size="sm"
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteDomain(domain)}
                            size="sm"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                          <a
                            href={domains[domain]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            Open
                          </a>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  else {
    return notFound();
  }
};

export default TodoApp;
