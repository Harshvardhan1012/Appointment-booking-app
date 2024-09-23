import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import loader from './../public/assets/icons/loader.svg'

interface ButtonProps{
  isLoading:boolean
  className?:string
  children:React.ReactNode
}

export const SubmitButton = ({isLoading,className,children}:ButtonProps) => {
  return (
  <>
      {isLoading && <Image src={loader} width={24} height={24} alt='loading..'>Loading...</Image>}

    <Button type='submit' disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
      {children}
    </Button>
    </>
  )
}
