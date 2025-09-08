
import React from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function SearchFilters({
  filters,
  setFilters,
  uniqueLocations
}) {
  const categories = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "product", label: "Product" },
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal" },
    { value: "hr", label: "HR" },
    { value: "cofounder", label: "Co-founder" },
    { value: "other", label: "Other" }
  ];

  const remoteTypes = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" }
  ];

  const salaryRanges = [
    { value: "0-50", label: "< $50k" },
    { value: "50-100", label: "$50k - $100k" },
    { value: "100-150", label: "$100k - $150k" },
    { value: "150-200", label: "$150k - $200k" },
    { value: "200+", label: "$200k+" },
    { value: "equity", label: "Equity Only" }
  ];

  const handleMultiSelectChange = (filterType, value, checked) => {
    setFilters(prev => {
      const currentValues = Array.isArray(prev[filterType]) ? prev[filterType] : [];
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const handleEquityChange = (value) => {
    setFilters(prev => ({
      ...prev,
      equityRange: value[0]
    }));
  };

  const getSelectedCount = (filterType) => {
    return Array.isArray(filters[filterType]) ? filters[filterType].length : 0;
  };

  const getFilterLabel = (filterType, defaultLabel) => {
    const count = getSelectedCount(filterType);
    return count > 0 ? `${defaultLabel} (${count})` : defaultLabel;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-700">Filter Jobs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Categories Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {getFilterLabel("categories", "Categories")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={Array.isArray(filters.categories) && filters.categories.includes(category.value)}
                      onCheckedChange={(checked) => handleMultiSelectChange('categories', category.value, checked)}
                    />
                    <Label htmlFor={`category-${category.value}`} className="text-sm">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Work Types Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {getFilterLabel("remoteTypes", "Work Types")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                {remoteTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={Array.isArray(filters.remoteTypes) && filters.remoteTypes.includes(type.value)}
                      onCheckedChange={(checked) => handleMultiSelectChange('remoteTypes', type.value, checked)}
                    />
                    <Label htmlFor={`type-${type.value}`} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Locations Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {getFilterLabel("locations", "Locations")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uniqueLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={Array.isArray(filters.locations) && filters.locations.includes(location)}
                      onCheckedChange={(checked) => handleMultiSelectChange('locations', location, checked)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Salary Multi-Select */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {getFilterLabel("salaryRanges", "Compensation")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                {salaryRanges.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`salary-${range.value}`}
                      checked={Array.isArray(filters.salaryRanges) && filters.salaryRanges.includes(range.value)}
                      onCheckedChange={(checked) => handleMultiSelectChange('salaryRanges', range.value, checked)}
                    />
                    <Label htmlFor={`salary-${range.value}`} className="text-sm">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Equity Slider */}
        <div className="mt-6 pt-6 border-t">
          <Label className="text-sm font-medium mb-4 block">
            Minimum Equity: {filters.equityRange || 0}%
          </Label>
          <Slider
            value={[filters.equityRange || 0]}
            onValueChange={handleEquityChange}
            max={100}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
