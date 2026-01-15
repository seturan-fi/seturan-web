import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ActionButton = ({
  label,
  onClick,
  disabled = false,
  isLoading = false,
}: ActionButtonProps) => {
  return (
    <div className="mt-auto pt-1">
      <Button
        type="button"
        variant="ghost"
        className="btn-action-primary"
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {label}
      </Button>
    </div>
  );
};
