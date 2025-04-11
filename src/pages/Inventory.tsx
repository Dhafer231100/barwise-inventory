import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { InventoryManagerView } from "@/components/inventory/InventoryManagerView";
import { ReadOnlyInventoryView } from "@/components/inventory/ReadOnlyInventoryView";

const Inventory = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const isInventoryStaff = user?.role === 'inventory_staff';

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // If the user is inventory staff, show the read-only view
  if (isInventoryStaff) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory Levels</h2>
            <p className="text-muted-foreground">
              Monitor current inventory levels across all bars
            </p>
          </div>
          <ReadOnlyInventoryView />
        </div>
      </Layout>
    );
  }

  // Otherwise, show the manager view with full functionality
  return (
    <Layout>
      <InventoryManagerView />
    </Layout>
  );
};

export default Inventory;
