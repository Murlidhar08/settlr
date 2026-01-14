'use client'

import { useEffect } from 'react'
import { Camera, User, Phone, Mail } from 'lucide-react'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { authClient, useSession } from '@/lib/auth-client'
import { BackHeader } from '@/components/back-header'
import { getInitials } from '@/utility/party'

type ProfileFormValues = {
  name: string
  email: string
  contactNo?: string
}

export default function AccountPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      contactNo: session?.user?.contactNo || '',
    },
  })

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        contactNo: session?.user?.contactNo || '',
      })
    }
  }, [session, reset])

  if (isPending) return <h1>Loading ...</h1>

  async function onSubmit(data: ProfileFormValues) {
    try {
      const promises = []

      promises.push(
        authClient.updateUser({
          name: data.name,
          contactNo: data.contactNo,
        })
      )

      if (data.email !== session?.user?.email) {
        promises.push(
          authClient.changeEmail({
            newEmail: data.email,
            callbackURL: '/account',
          })
        )
      }

      const res = await Promise.all(promises)

      const updateUserResult = res[0]
      const emailResult = res[1] ?? { error: false }

      if (updateUserResult?.error) {
        toast.error(updateUserResult.error.message || 'Failed to update profile')
        return
      }

      if (emailResult?.error) {
        toast.error(emailResult.error.message || 'Failed to change email')
        return
      }

      if (data.email !== session?.user?.email) {
        toast.success('Verify your new email address to complete the change.')
      } else {
        toast.success('Profile updated successfully')
      }

      router.refresh()
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Something went wrong', error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative min-h-screen bg-background pb-28"
    >
      {/* Top App Bar */}
      <BackHeader title='Edit Profile' backUrl='/settings' isProfile={true} />

      {/* Avatar Section */}
      <section className="flex flex-col items-center py-8">
        <div className="relative">
          <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback className="text-2xl">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow cursor-pointer"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold text-primary">Change Photo</p>
      </section>

      {/* Form Fields */}
      <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4">
        <Field
          label="Full Name"
          icon={User}
          registration={register('name', { required: true })}
        />

        <Field
          label="Phone Number"
          icon={Phone}
          registration={register('contactNo')}
        />

        <Field
          label="Email Address"
          icon={Mail}
          type="email"
          disabled={true}
          registration={register('email', { required: true })}
        />
      </section>

      {/* Submit */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 w-full rounded-xl text-base font-semibold"
        >
          <LoadingSwap isLoading={isSubmitting}>
            Save Changes
          </LoadingSwap>
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  icon: Icon,
  registration,
  type = "text",
  disabled = false,
}: {
  label: string
  icon: React.ElementType
  registration: UseFormRegisterReturn
  type?: string
  disabled?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 ${disabled ? "cursor-not-allowed select-none" : ""}`}>
      <label className="ml-1 text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          disabled={disabled}
          type={type}
          {...registration}
          className="h-14 rounded-xl pr-10"
        />
        <Icon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}
