
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface CartHeaderProps {
  title?: string;
}

const CartHeader: React.FC<CartHeaderProps> = ({ title = "Mon Panier" }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/marketplace">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <h1 className="text-3xl font-bold text-gray-900 flex-1">{title}</h1>
      <Button variant="ghost" size="icon" asChild>
        <Link to="/marketplace" title="Accueil Marketplace">
          <Home className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};

export default CartHeader;

