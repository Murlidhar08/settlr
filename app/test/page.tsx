// Source - https://stackoverflow.com/a/78012182
// Posted by Ahmed Abdelbaset
// Retrieved 2025-12-14, License - CC BY-SA 4.0

"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);

    console.log("isOpen", isOpen);

    return (
        <>
            <Button variant="secondary" onClick={() =>
                setIsOpen(true)
            }>
                Another Button
            </Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger>Open Drawer</DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle>Hello</DrawerTitle>
                    <DrawerDescription>HHH</DrawerDescription>
                    Drawer Content
                </DrawerContent>
            </Drawer>
        </>
    );
}
