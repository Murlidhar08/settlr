'use client'

import * as React from 'react'
import { ArrowLeft, Camera, User, Store, Phone, Mail, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AccountPage() {
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
                        <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmO4aBu60OoiO1rjHCGaM_A6LY6PrmSOiWoNLCcElzIhhAYGURbHNu8cnq3VPIzEz2ZY5hUbhdg22FBOq1vouszpBYqHuwVCbtiPBrASgouKjCps3mh5yZcbgYMpt0cgWECVDXJabe9cepFi53o7CfDJsEsIFIsOvwLiePzj94tucnti3KQAmlWnoRNP_kDTyU0Kk2futwt3o9gVDdqmyr3wMIGg1ONhPyW56dGPgRuI05HTVajNbohag1nGuomuotyHBi-s03hfAc" />
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
                <Field label="Full Name" icon={User} defaultValue="Alex Sterling" />
                <Field label="Business Name" icon={Store} defaultValue="Sterling Logistics LLC" />
                <Field label="Phone Number" icon={Phone} defaultValue="+1 (555) 000-0000" />
                <Field label="Email Address" icon={Mail} defaultValue="alex@sterlinglogistics.com" type="email" />
            </section>

            {/* Danger Zone */}
            <section className="mx-auto mt-8 w-full max-w-lg px-4">
                <Card className="p-4">
                    <button className="flex w-full items-center justify-between rounded-lg transition-colors hover:bg-destructive/5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-destructive">Log Out</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                </Card>
                <p className="mt-6 text-center text-xs text-muted-foreground">Version 2.4.0 (Build 1024)</p>
            </section>

            {/* Bottom Action Bar */}
            <footer className="fixed bottom-0 left-0 w-full border-t bg-background p-4 pb-8">
                <div className="mx-auto max-w-lg">
                    <Button className="h-14 w-full text-base font-bold shadow-lg" size="lg">
                        Save Changes
                    </Button>
                </div>
            </footer>
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
