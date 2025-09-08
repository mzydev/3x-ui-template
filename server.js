import express from "express"
import fetch from "node-fetch"
import qs from "querystring"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { toJalaali } from "jalaali-js"
import https from "https"
import http from "http"
import speakeasy from "speakeasy"

const app = express()

const CONFIG_FILE_NAME = "sixtininelearn.config"
const BROWSER_KEYWORDS = ["Mozilla", "Chrome", "Safari", "Edge", "Opera", "Firefox", "Trident", "WebKit"]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadConfig = () => {
  const configFile = path.join(__dirname, CONFIG_FILE_NAME)
  if (!fs.existsSync(configFile)) {
    console.error("Error: Configuration file 'sixtininelearn.config' not found!")
    process.exit(1)
  }

  return fs
    .readFileSync(configFile, "utf-8")
    .split("\n")
    .reduce((acc, line) => {
      const [key, value] = line.split("=").map((item) => item.trim())
      if (key && value) acc[key] = value
      return acc
    }, {})
}

const config = loadConfig()

const {
  HOST: sixtininelearn_host = "localhost",
  PORT: sixtininelearn_port = "8080",
  PATH: sixtininelearn_path = "",
  USERNAME = "",
  PASSWORD = "",
  PROTOCOL = "http",
  SUBSCRIPTION = "",
  PUBLIC_KEY_PATH = "",
  PRIVATE_KEY_PATH = "",
  TEMPLATE_NAME = "default",
  DEFAULT_LANG = "en",
  SUB_HTTP_PORT = "3000",
  SUB_HTTPS_PORT = "443",
  TELEGRAM_URL = "",
  WHATSAPP_URL = "",
  Backup_link: BACKUP_LINK = "",
  TOTP_SECRET = "",
  TWO_FACTOR = "false",
} = config

const convertToJalali = (timestamp) => {
  const date = new Date(timestamp)
  const { jy, jm, jd } = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return `${jy}/${jm}/${jd}`
}

const isBrowserRequest = (userAgent = "") => BROWSER_KEYWORDS.some((keyword) => userAgent.includes(keyword))

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, `views/templates/${TEMPLATE_NAME}`))
app.set("view engine", "ejs")

const fetchWithRetry = async (url, options, retries = 3) => {
  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    return response
  } catch (error) {
    if (retries <= 0) throw error
    return fetchWithRetry(url, options, retries - 1)
  }
}

app.get(`/${SUBSCRIPTION.split("/")[3]}/:subId`, async (req, res) => {
  try {
    const { subId: targetSubId } = req.params
    const userAgent = req.headers["user-agent"] || ""

    const loginPayload = {
      username: USERNAME,
      password: PASSWORD,
    }

    if (TWO_FACTOR === "true" && TOTP_SECRET) {
      const currentTOTP = speakeasy.totp({
        secret: TOTP_SECRET,
        encoding: "base32",
        window: 1,
      })
      loginPayload.twoFactorCode = currentTOTP
    }

    const [loginResponse, suburl_content] = await Promise.all([
      fetchWithRetry(`${PROTOCOL}://${sixtininelearn_host}:${sixtininelearn_port}/${sixtininelearn_path}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: qs.stringify(loginPayload),
      }),
      fetchUrlContent(`${SUBSCRIPTION}${targetSubId}`),
    ])

    if (!loginResponse.ok) throw new Error("Login request failed.")

    const loginResult = await loginResponse.json()
    if (!loginResult.success) throw new Error(loginResult.msg || "Login unsuccessful")

    const cookie = loginResponse.headers.get("set-cookie")
    const listResponse = await fetchWithRetry(
      `${PROTOCOL}://${sixtininelearn_host}:${sixtininelearn_port}/${sixtininelearn_path}/panel/api/inbounds/list`,
      {
        method: "GET",
        headers: { cookie, Accept: "application/json" },
      },
    )

    const listResult = await listResponse.json()
    const foundClient = listResult.obj
      .flatMap((inbound) => JSON.parse(inbound.settings).clients)
      .find((client) => client.subId === targetSubId)

    if (!foundClient) return res.status(404).json({ message: "No object found with the specified subId." })

    const trafficResponse = await fetchWithRetry(
      `${PROTOCOL}://${sixtininelearn_host}:${sixtininelearn_port}/${sixtininelearn_path}/panel/api/inbounds/getClientTraffics/${foundClient.email}`,
      {
        method: "GET",
        headers: { cookie, Accept: "application/json" },
      },
    )

    const trafficData = await trafficResponse.json()
    const expiryTimeJalali = convertToJalali(trafficData.obj.expiryTime)
    const suburl = `${req.protocol}://${req.get("host")}${req.originalUrl}`

    if (isBrowserRequest(userAgent)) {
      return res.render("sub", {
        data: {
          ...trafficData.obj,
          expiryTimeJalali,
          suburl,
          suburl_content,
          get_backup_link: BACKUP_LINK,
          WHATSAPP_URL,
          TELEGRAM_URL,
          DEFAULT_LANG,
        },
      })
    }

    const combinedContent = [BACKUP_LINK, Buffer.from(suburl_content, "base64").toString("utf-8")]
      .filter(Boolean)
      .join("\n")

    res.send(Buffer.from(combinedContent, "utf-8").toString("base64"))
  } catch (error) {
    console.error("Error:", error.message)
    res.status(500).json({ error: error.message })
  }
})

app.get("/guide/:platform", (req, res) => {
  const { platform } = req.params
  const validPlatforms = ["ios", "android", "linux", "windows"]

  if (!validPlatforms.includes(platform)) {
    return res.status(404).send("Platform not found")
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8")

  res.render("guide", {
    platform: platform,
    platformName: {
      ios: "آیفون / مک",
      android: "اندروید",
      linux: "لینوکس",
      windows: "ویندوز",
    }[platform],
  })
})

const fetchUrlContent = async function fetchUrlContent(url) {
  try {
    const isHttps = url.startsWith("https://")
    const agent = isHttps ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent()
    const response = await fetch(url, { agent })
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${url}, Status: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error.message)
    throw error
  }
}

const startServers = () => {
  http.createServer(app).listen(SUB_HTTP_PORT, () => {
    console.log(`HTTP Server is running on port ${SUB_HTTP_PORT}`)
  })

  if (PUBLIC_KEY_PATH && PRIVATE_KEY_PATH && fs.existsSync(PUBLIC_KEY_PATH) && fs.existsSync(PRIVATE_KEY_PATH)) {
    const options = {
      key: fs.readFileSync(PRIVATE_KEY_PATH),
      cert: fs.readFileSync(PUBLIC_KEY_PATH),
    }
    https.createServer(options, app).listen(SUB_HTTPS_PORT, () => {
      console.log(`HTTPS Server is running on port ${SUB_HTTPS_PORT}`)
    })
  } else {
    console.warn("SSL certificates not found. Only HTTP server is running.")
  }
}

startServers()
