/* @flow */
import fetch from '../../util/request'
import qs from 'querystring'
// Types
import type { SmsRequestType } from '../../models/notification-request'

export default class SmsMagfaProvider {
  id: string = 'sms-46elks-provider'
  apiKey: string

  constructor ({ apiUsername, apiPassword, apiDomain }: Object) {
    this.apiKey = Buffer.from(`${apiUsername}/${apiDomain}:${apiPassword}`).toString('base64')
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const { from, to, text } = request.customize ? (await request.customize(this.id, request)) : request
    const response = await fetch('https://sms.magfa.com/api/http/sms/v2/send/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.apiKey}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: {
        senders: ['300090002003'],
        recipients: to,
        messages: [text]
      }
    })

    if (response.ok) {
      const responseBody = await response.json()
      return responseBody.id
    } else {
      throw new Error(await response.text())
    }
  }
}
