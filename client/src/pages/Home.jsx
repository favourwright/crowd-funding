import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { CampaignList } from '../components'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState([])
  const { contract, address, getCampaigns } = useStateContext()

  const fetchCampaigns = async () => {
    setIsLoading(true)
    const data = await getCampaigns()
    setCampaigns(data)
    setIsLoading(false)
  } 

  useEffect(() => {
    if(contract) fetchCampaigns()
  }, [address, contract])


  return (
    <div>
      <CampaignList
        title="All Campaigns"
        campaigns={campaigns}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Home