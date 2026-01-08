
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CheckoutHeaderProps {
  title?: string;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ title = "Finaliser ma commande" }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/cart">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    </div>
  );
};

export default CheckoutHeader;
