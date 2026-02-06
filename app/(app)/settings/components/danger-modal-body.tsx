'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth-client'

export function DangerModalBody() {
    return (
        <div className="space-y-6">
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        Delete Account Permanently
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This action is irreversible. Deleting your account will
                        permanently remove all your data, businesses, transactions, and
                        access. You will need to confirm this action via email.
                    </p>

                    <BetterAuthActionButton
                        requireAreYouSure
                        variant="destructive"
                        className="w-full"
                        successMessage="Account deletion initiated. Please check your email to confirm."
                        action={() =>
                            authClient.deleteUser({
                                callbackURL: '/',
                            })
                        }
                    >
                        Delete Account Permanently
                    </BetterAuthActionButton>
                </CardContent>
            </Card>
        </div>
    )
}
