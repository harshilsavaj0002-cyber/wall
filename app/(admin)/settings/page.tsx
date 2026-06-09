"use client"

import { PageHeader } from "@/components/shared/PageHeader"
import { ProfileForm } from "@/components/settings/ProfileForm"
import { PasswordForm } from "@/components/settings/PasswordForm"
import { AppearanceCard } from "@/components/settings/AppearanceCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Manage your account, security and preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6 max-w-2xl">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security" className="mt-6 max-w-2xl">
          <PasswordForm />
        </TabsContent>
        <TabsContent value="appearance" className="mt-6 max-w-2xl">
          <AppearanceCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
