import React, { useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import LandWightsLogo from './LandWightsLogo'
import { UserContext } from '../UserProvider/UserProvider'

import * as styles from './Logo.treat'

const Logo: React.FC = () => {
  const { user } = useContext(UserContext)

  return (
    <div className={styles.logoContainer}>
      <Box marginRight={2}>
        <LandWightsLogo />
      </Box>
      <p className={styles.logoText}>{user?.institution}</p>
    </div>
  )
}

export default Logo