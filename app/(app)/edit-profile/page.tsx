'use client'

import { useEffect } from 'react'
import { Camera, User, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { authClient, useSession } from '@/lib/auth-client'
import { BackHeader } from '@/components/back-header'
import { getInitials } from '@/utility/party'
import { FooterButtons } from '@/components/footer-buttons'
import { Skeleton } from '@/components/ui/skeleton'

type ProfileFormValues = {
  name: string
  email: string
  contactNo?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function EditProfilePage() {
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

  if (isPending) return <EditProfileSkeleton />;

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
            callbackURL: '/profile',
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
      router.push('/profile' as any)
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Something went wrong', error);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen bg-background pb-32"
    >
      <BackHeader title='Edit Profile' backUrl={'/profile' as any} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Section */}
        <motion.section variants={itemVariants} className="flex flex-col items-center py-10 relative">
          <div className="relative group">
            <Avatar className="h-32 w-32 ring-4 ring-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg cursor-pointer border-4 border-background"
            >
              <Camera className="h-5 w-5" />
            </motion.button>
            <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-primary/60">Upload New Avatar</p>
        </motion.section>

        {/* Form Fields */}
        <motion.section variants={itemVariants} className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6">
          <Field
            label="What's your name?"
            icon={User}
            registration={register('name', { required: "Name is required" })}
          />

          <Field
            label="Phone Number"
            icon={Phone}
            registration={register('contactNo')}
            placeholder="+1 (555) 000-0000"
          />

          <Field
            label="Email Address"
            icon={Mail}
            type="email"
            disabled={true}
            registration={register('email', { required: "Email is required" })}
          />
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/20">
            <CheckCircle2 size={16} className="text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Email changes require verification for your security.</p>
          </div>
        </motion.section>

        {/* Submit */}
        <FooterButtons>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="px-12 flex-1 h-14 rounded-2xl gap-3 font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 transition-all hover:shadow-2xl active:scale-[0.98]"
          >
            <LoadingSwap isLoading={isSubmitting}>
              Update My Profile
            </LoadingSwap>
          </Button>
        </FooterButtons>
      </form>
    </motion.div>
  )
}

function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Edit Profile" />
      <div className="flex flex-col items-center py-10 space-y-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mx-auto max-w-lg space-y-6 px-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  registration,
  type = "text",
  disabled = false,
  placeholder = "",
}: {
  label: string
  icon: React.ElementType
  registration: UseFormRegisterReturn
  type?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-60 grayscale-[0.5]" : ""}`}>
      <label className="ml-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative group">
        <Input
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          {...registration}
          className="h-14 rounded-2xl pr-12 bg-muted/10 border-muted-foreground/10 focus:bg-background transition-all duration-300 font-bold"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-transparent flex items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

