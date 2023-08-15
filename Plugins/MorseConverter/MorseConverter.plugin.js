/**
 * @name Morse
 * @description Converts inputted text into Morse code by using slash-commands.
 * @version 1.0.0
 * @author Daaku
 */

module.exports = (() => {
  const config = {
    info: {
      name: "Morse",
      authors: [
        {
          name: "Daaku",
          discord_id: "YourDiscordID",
          github_username: "D4aku",
        },
      ],
      version: "1.0.0",
      description: "Converts inputted text into Morse code by using slash-commands.",
      github: "https://github.com/D4aku/BetterDiscordPlugins/tree/main/Plugins/MorseConverter",
      github_raw:
        "https://github.com/D4aku/BetterDiscordPlugins/blob/main/Plugins/MorseConverter/MorseConverter.plugin.js",
    },
    changelog: [
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the Morse plugin.",
          "Converts inputted text into Morse code by using slash-commands.",
	  "This Plugin uses Code from Ahlawat's Nekos Plugin",
	  "This Plugin will instantly be removed if Ahlawat says so",
        ],
      },
    ],
    main: "MorseConverter.plugin.js",
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
          A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
          F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
          K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
          P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
          U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
          Z: "--..", " ": "/", "1": ".----", "2": "..---",
          "3": "...--", "4": "....-", "5": ".....", "6": "-....",
          "7": "--...", "8": "---..", "9": "----.", "0": "-----"
        };

        return class Morse extends Plugin {
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
              name: "morse",
              displayName: "morse",
              displayDescription: "Convert text to Morse code.",
              description: "Convert text to Morse code.",
              type: 1,
              target: 1,
              execute: async ([send, sendOption], { channel }) => {
  try {
    const text = send.value;
    const morseCode = this.convertToMorse(text);
    
    if (!morseCode) {
      return MessageActions.receiveMessage(
        channel.id,
        LibraryUtils.FakeMessage(
          channel.id,
          "Failed to convert text to Morse code."
        )
      );
    }

    if (sendOption.value === false) {
  	MessageActions.receiveMessage(
    	    channel.id,
    	    LibraryUtils.FakeMessage(
                channel.id,
      		morseCode
    	    )
  	);
    } else {
  	MessageActions.sendMessage(
    	    channel.id,
    	    {
      	    	content: morseCode,
	    	tts: false,
      	    	validNonShortcutEmojis: [],
    	    },
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
        "Failed to convert text to Morse code."
      )
    );
  }
},
              options: [
                {
                  description: "Text to convert.",
                  displayDescription: "Text to convert.",
                  displayName: "Text",
                  name: "Text",
		  required: true,
                  type: 3,
                },
		{
		  description: "Whether you want to send this or not.",
                  displayDescription: "Whether you want to send this or not.",
                  displayName: "Send",
                  name: "Send",
                  type: 5,
		},
              ],
            });
          }

          convertToMorse(text) {
            text = text.toUpperCase();
            const morseArray = [];
            for (const char of text) {
              if (MorseCodeMap[char]) {
                morseArray.push(MorseCodeMap[char]);
              }
            }
            return morseArray.join(" ");
          }

          onStop() {
            ApplicationCommandAPI.unregister(config.info.name);
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
