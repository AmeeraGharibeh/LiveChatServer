const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
    },
    room_password: {
      type: String,
    },
    name_password: {
      type: String,
    },

    user_type: {
      type: String,
      default: "member",
    },

    name_type: {
      type: String,
      default: "-",
    },

    name_start_date: {
      type: String,
      default: "-",
    },

    name_end_date: {
      type: String,
      default: "-",
    },

    is_ip_blocked: {
      type: Boolean,
      default: false,
    },
    is_device_blocked: {
      type: Boolean,
      default: false,
    },
    is_owner: {
      type: Boolean,
      default: false,
    },

    talk_time: {
      type: String,
      default: "0",
    },

    online: {
      type: String,
      default: "0",
    },

    visitors: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      default: "-",
    },

    birthday: {
      type: String,
      default: "-",
    },

    work: {
      type: String,
      default: "-",
    },
    lock_device: {
      type: Boolean,
      default: false,
    },

    country: {
      type: String,
      default: "-",
    },

    city: {
      type: String,
      default: "-",
    },

    state: {
      type: String,
      default: "-",
    },

    about: {
      type: String,
      default: "-",
    },

    ip: {
      type: String,
      default: "-",
    },

    socket_id: {
      type: String,
      default: "-",
    },

    icon: {
      type: String,
      default: "-",
    },

    pic: {
      type: String,
      default:
        "https://storage.googleapis.com/grocery-372908.appspot.com/user_acc.png",
    },

    cover: {
      type: String,
      default: "-",
    },

    album: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    ignored_list: {
      type: Array,
      default: [],
    },

    blockers_list: {
      type: Array,
      default: [],
    },

    private_msg: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: {},
      default: {
        block_device: false,
        kick_out: false,
        stop: false,
        mic: false,
        public_msg: false,
        remove_msgs: false,
        remove_block: false,
        logout_history: false,
        users_control: false,
        member_control: false,
        admin_control: false,
        super_admin: false,
        master_control: false,
        room_settings: false,
        reports: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
