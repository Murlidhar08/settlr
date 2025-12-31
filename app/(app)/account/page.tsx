'use client'

import * as React from 'react'
import { ArrowLeft, Camera, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from "@/lib/auth-client";

export default function AccountPage() {
  const { data: session, isPending } = useSession();

  if (isPending)
    return <h1>Loading ...</h1>

  return (
    <div className="relative min-h-screen bg-background pb-28">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 backdrop-blur px-4 py-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-bold tracking-tight">Edit Profile</h2>
        <div className="w-10" />
      </header>

      {/* Avatar Section */}
      <section className="flex flex-col items-center py-8">
        <div className="relative">
          <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold text-primary">Change Photo</p>
      </section>

      {/* Form */}
      <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4">
        <Field label="Full Name" icon={User} defaultValue={session?.user?.name} />
        {/* <Field label="Business Name" icon={Store} defaultValue="Sterling Logistics LLC" /> */}
        <Field label="Phone Number" icon={Phone} defaultValue={session?.user?.contactNo} />
        <Field label="Email Address" icon={Mail} defaultValue={session?.user?.email} type="email" />
      </section>
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  defaultValue,
  type = 'text',
}: {
  label: string
  icon: React.ElementType
  defaultValue?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 text-sm font-medium">{label}</label>
      <div className="relative">
        <Input type={type} defaultValue={defaultValue} className="h-14 rounded-xl pr-10" />
        <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}
