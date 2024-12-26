"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  credits: number;
}

function CountBox({ text }: { readonly text: number }) {
  const style = "font-bold text-md mx-1";
  const color = text > 0 ? "text-primary" : "text-red-500";
  return (
    <div className="flex items-center justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none">
      You have<span className={cn(style, color)}>{text}</span>credit(s)
    </div>
  );
}

export function ProfileForm({
  data,
  className,
}: {
  readonly data: ProfileFormProps;
  readonly className?: string;
}) {
  return (
    <form className={cn("space-y-4", className)}>
      <div className="space-y-4 grid ">
        <div className="grid grid-cols-3 gap-4">
          <Input
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={data?.username || ""}
            disabled
          />
          <Input
            id="email"
            name="email"
            placeholder="Email"
            defaultValue={data?.email || ""}
            disabled
          />
        </div>

{/*         <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            defaultValue={data?.firstName || ""}
          />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            defaultValue={data?.lastName || ""}
          />
        </div> */}
      </div>
      {/* <div className="flex justify-end">
        <SubmitButton text="Update Profile" loadingText="Saving Profile" />
      </div> */}
    </form>
  );
}