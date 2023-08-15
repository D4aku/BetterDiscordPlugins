/**
 * @name deMorse
 * @description Converts inputted Morse code into text by using slash-commands.
 * @version 1.0.2
 * @author Daaku
 */

module.exports = (() => {
  const config = {
    info: {
      name: "deMorse",
      authors: [
        {
          name: "Daaku",
          discord_id: "607195119875260438",
          github_username: "D4aku",
        },
      ],
      version: "1.0.2",
      description: "Converts inputted Morse code into text by using slash-commands.",
      github: "https://github.com/D4aku/BetterDiscordPlugins/tree/main/Plugins/deMorseConverter",
      github_raw:
        "https://raw.githubusercontent.com/D4aku/BetterDiscordPlugins/main/Plugins/deMorseConverter/deMorseConverter.plugin.js",
    },
    changelog: [
      {
        title: "Disclaimer!",
        items: [
	  "This Plugin uses Code from Ahlawat's Nekos Plugin, thank you a lot!",
	  "This Plugin will instantly be removed if Ahlawat says so!",
        ],
        title: "Release v1.0.2",
        items: [
          "Added more symbols from the International Morse Code.",
        ],
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the deMorse plugin.",
          "Converts inputted Morse code into text by using slash-commands.",
          "Supports 36 letters of the International Morse Code.",
        ],
      },
    ],
    main: "deMorseConverter.plugin.js",
  };

  const RequiredLibs = [
    {
      window: "ZeresPluginLibrary",
      filename: "0PluginLibrary.plugin.js",
      external:
        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
      downloadUrl:
        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    },
  ];

  return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
        const {
          PluginUpdater,
          Logger,
          DiscordModules: { MessageActions },
        } = ZLibrary;

        const { LibraryUtils, ApplicationCommandAPI } = BunnyLib.build(config);

        const MorseCodeMap = {
".-": "a", "-...": "b", "-.-.": "c", "-..": "d", ".": "e",
"..-.": "f", "--.": "g", "....": "h", "..": "i", ".---": "j",
"-.-": "k", ".-..": "l", "--": "m", "-.": "n", "---": "o",
".--.": "p", "--.-": "q", ".-.": "r", "...": "s", "-": "t",
"..-": "u", "...-": "v", ".--": "w", "-..-": "x", "-.--": "y",
"--..": "z", "/": " ", ".----": "1", "..---": "2",
"...--": "3", "....-": "4", ".....": "5", "-....": "6",
"--...": "7", "---..": "8", "----.": "9", "-----": "0",
".-.-.-": ".", "--..--": ",", "..--..": "?", ".----.": "'",
"-.-.--": "!", "-..-.": "/", "-.--.": "(", "-.--.-": ")",
".-...": "&", "---...": ":", "-.-.-.": ";", "-...-": "=",
".-.-.": "+", "-....-": "-", "..--.-": "_", ".-..-.": "\"",
"...-..-": "$", ".--.-.": "@"
        };

        return class deMorse extends Plugin {
          checkForUpdates() {
            try {
              PluginUpdater.checkForUpdate(
                config.info.name,
                config.info.version,
                config.info.github_raw
              );
            } catch (err) {
              Logger.err("Plugin Updater could not be reached.", err);
            }
          }

          start() {
            this.checkForUpdates();
            this.addCommand();
          }

          addCommand() {
            ApplicationCommandAPI.register(config.info.name, {
              name: "demorse",
              displayName: "demorse",
              displayDescription: "Convert Morse code to text.",
              description: "Convert Morse code to text.",
              type: 1,
              target: 1,
              execute: async ([send, sendOption], { channel }) => {
                try {
                  const morseCode = send.value.trim();
                  const text = this.convertFromMorse(morseCode);
                  if (!text) {
                    return MessageActions.receiveMessage(
                      channel.id,
                      LibraryUtils.FakeMessage(
                        channel.id,
                        "Failed to convert Morse code to text."
                      )
                    );
                  }
                  const shouldSend = sendOption.value === undefined || sendOption.value === true;
                  if (shouldSend) {
                    MessageActions.sendMessage(
                      channel.id,
                      {
                        content: text,
                        tts: false,
                        validNonShortcutEmojis: [],
                      }
                    );
                  } else {
                    MessageActions.receiveMessage(
                      channel.id,
                      LibraryUtils.FakeMessage(
                        channel.id,
                        text
                      ),
                      undefined,
                      {}
                    );
                  }
                } catch (err) {
                  Logger.err(err);
                  MessageActions.receiveMessage(
                    channel.id,
                    LibraryUtils.FakeMessage(
                      channel.id,
                      "Failed to convert Morse code to text."
                    )
                  );
                }
              },
              options: [
                {
                  description: "Morse code to convert.",
                  displayDescription: "Morse code to convert.",
                  displayName: "Morse Code",
                  name: "MorseCode",
                  required: true,
                  type: 3,
                },
                {
                  description: "Whether you want to send this or not.",
                  displayDescription: "Whether you want to send this or not.",
                  displayName: "Send",
                  name: "Send",
                  required: true,
                  type: 5,
                },
              ],
            });
          }

          convertFromMorse(morseCode) {
            const morseArray = morseCode.split(" ");
            const textArray = morseArray.map(code => MorseCodeMap[code] || '').filter(char => char !== '');
            return textArray.join('');
          }

          onStop() {
            ApplicationCommandAPI.unregister(config.info.name);
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
