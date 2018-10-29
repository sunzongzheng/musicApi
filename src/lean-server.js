import app from './express-app'
import AV from 'leanengine'

AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})

app.use(AV.express())

app.listen(process.env.PORT || 3000)