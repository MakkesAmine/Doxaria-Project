"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PhoneCall,
  Mail,
  MessageSquare,
  Clock,
  Stethoscope,
  PillIcon as Pills,
  Shield,
  Send,
  Loader2,
} from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [urgency, setUrgency] = useState("non-urgent")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contact Support</h1>
        <p className="text-muted-foreground mt-2">Get in touch with our medical support team or technical assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>For immediate medical assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <PhoneCall className="h-4 w-4" />
              <a href="tel:911" className="font-bold">
                911
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              For medical emergencies, please dial 911 or visit your nearest emergency room immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>24/7 Support</CardTitle>
            <CardDescription>Always here to help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@doxaria.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Live Chat Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Response within 1 hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
            <CardDescription>Medical support availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </p>
              <p className="text-sm text-muted-foreground mt-4">Technical support available 24/7</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select defaultValue="medical">
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Medical Support
                    </div>
                  </SelectItem>
                  <SelectItem value="prescription">
                    <div className="flex items-center gap-2">
                      <Pills className="h-4 w-4" />
                      Prescription Management
                    </div>
                  </SelectItem>
                  <SelectItem value="technical">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Technical Support
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <RadioGroup defaultValue="non-urgent" onValueChange={setUrgency} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">Urgent - Need assistance within 24 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard - Response within 2-3 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-urgent" id="non-urgent" />
                  <Label htmlFor="non-urgent">Non-urgent - General inquiry</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please describe your issue or question in detail..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

