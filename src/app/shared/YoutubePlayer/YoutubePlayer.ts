import { EventNames, EventBus } from "./../../../services/eventBus/index";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { asyncYoutubeIframeAPI } from "@/services/youtube/youtubeIframe";
import FloatingDiv from "@/app/shared/FloatingDiv/FloatingDiv.vue";
import { randomString } from "@/extras/utils";
@Component({
  components: {
    FloatingDiv
  }
})
export default class YoutubePlayer extends Vue {
  player: YT.Player | null = null;
  asyncPlayerState!: Promise<void>;
  elementToAttach = randomString();
  isPlayerReady: boolean = false;

  @Prop({ type: String, required: true })
  videoId!: string;

  async mounted() {
    await this.makePlayerReady();
  }

  @Watch("videoId")
  async changeVideo(newId: string, oldId: string) {
    await this.asyncPlayerState;

    if (newId !== oldId) {
      this.player!.loadVideoById(this.videoId + "fewfw ");
    }
  }

  async makePlayerReady() {
    this.asyncPlayerState = new Promise(async resolve => {
      await asyncYoutubeIframeAPI;
      this.player = new YT.Player(this.elementToAttach, {
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          hl: this.$i18n.locale,
          origin: window.location.origin
        },
        videoId: this.videoId,
        events: {
          onReady: () => {
            this.isPlayerReady = true;
            this.player!.playVideo();
            EventBus.$emit(EventNames.playerReady, this.player);
            resolve();
          }
        }
      });
    });
  }
}
