import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { CampaignList } from '../components'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState([])
  const { contract, address, getUserCampaigns } = useStateContext()

  const fetchCampaigns = async () => {
    setIsLoading(true)
    const data = await getUserCampaigns()
    setCampaigns(data)
    setIsLoading(false)
  } 

  useEffect(() => {
    if(contract) fetchCampaigns()
  }, [address, contract])


  return (
    <div>
      <CampaignList
        title="My Campaigns"
        campaigns={campaigns}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Profile