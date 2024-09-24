import React from 'react'
import { RadioGroupItem } from './radio-group'
import { Label } from './label'

export default function RadioButton ({value}:{value:string}) {
    return (
        <div className="flex items-center space-x-2 border-dashed border border-gray-700 p-3 rounded-lg">
            <RadioGroupItem value={value} id="r1" />
            <Label>{value}</Label>
        </div>
    )
}
