"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Clock } from "lucide-react"

export default function Pharmacies() {
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState("")

  const handleSearch = () => {
    // Here you would typically fetch pharmacy data based on location and radius
    console.log("Searching for pharmacies:", { location, radius })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Partner Pharmacies</h1>

      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Pharmacies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="location">Your Location</Label>
              <Input
                id="location"
                placeholder="Enter your address or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="radius">Search Radius</Label>
              <Input
                id="radius"
                type="number"
                placeholder="Miles"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>
            <Button className="mt-8" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nearby Pharmacies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pharmacy Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Operating Hours</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>CVS Pharmacy</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    123 Main St, Anytown, USA
                  </div>
                </TableCell>
                <TableCell>0.5 miles</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    8:00 AM - 10:00 PM
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline">View Details</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Walgreens</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    456 Oak Ave, Anytown, USA
                  </div>
                </TableCell>
                <TableCell>1.2 miles</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    24 hours
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline">View Details</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

