"use client";

import { ChevronLeft, Gauge, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Dispatch, JSX, SetStateAction } from "react";
import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "sovendus-integration-settings-ui/ui";

import { clearStorage } from "./self-tester";

interface AdminBarProps {
  configContent: (
    setConfigOpen: Dispatch<SetStateAction<boolean>>,
  ) => JSX.Element;
  pageName: string;
}

export function AdminBar({
  configContent,
  pageName,
}: AdminBarProps): JSX.Element {
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <>
      <div className="bg-black text-white h-10 fixed top-0 left-0 right-0 z-50 flex items-center px-4 shadow-md">
        <div className="flex items-center justify-between w-full container m-auto">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="admin-bar-button flex items-center text-sm font-medium hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Admin
            </Link>
            <div className="h-4 border-r border-gray-700"></div>
            <div className="flex items-center text-sm">
              <Gauge className="h-4 w-4 mr-1" />
              <span>
                Current Page Type:
                <Badge variant={"destructive"} className="ml-1 font-medium">
                  {pageName}
                </Badge>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="unstyled"
              size="sm"
              className="text-red-400 hover:text-red-500 p-0 h-auto"
              onClick={clearStorage}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Reset all Settings
            </Button>
            <Button
              variant="unstyled"
              size="sm"
              className="text-orange-400 hover:text-orange-500 p-0 h-auto admin-bar-button"
              onClick={() => setConfigOpen(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure {pageName}
            </Button>
          </div>
        </div>
      </div>

      {/* Add padding to the top of the page to account for the admin bar */}
      <div className="h-10"></div>

      {/* Configuration Modal */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-[800px] max-h-[80vh] overflow-auto mt-[50px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {pageName} Configuration
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">{configContent(setConfigOpen)}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
