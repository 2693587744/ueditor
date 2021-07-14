/**
  * audio插件，为UEditor提供音频插入支持
  */
UE.plugins['audio'] = function () {
    var me = this;
    // 从publis.js中获取的静态文件路径，需自行修改设置
    var playicon = "http://static1.weizan.cn/zhibo/images/play.png";
    var pauseicon = "http://static1.weizan.cn/zhibo/images/pause.png";

    // 内容填入后初始化音频控件
    me.addListener("afterSetContent", function () {
        var audioArr = me.document.getElementsByTagName('audio');
        if (audioArr) {
            $.each(audioArr, function (i, a) {
                var aDiv = domUtils.findParent(a, function (node) {
                    return node.className === 'audio-wrapper';
                });
                if (aDiv) {
                    initAudioEvent(aDiv);
                }
            });
        }
    });

    /**
     * 插入音频
     * @command insertaudio
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @param { Object } audioObjs 键值对对象， 描述一个音频的所有属性
     * @example
     * ```javascript
     *
     * var audioObjs = {
     *      // 音频地址
     *      src: 'http://www.xxx.com/yyy',
     *      // 音频标题
     *      title: 'this is a title'
     * };
     *
     * //editor 是编辑器实例
     * //向编辑器插入单个音频
     * editor.execCommand( 'insertaudio', audioObjs );
     * ```
     */
    me.commands["insertaudio"] = {
        execCommand: function (cmd, audioObjs) {
            audioObjs = utils.isArray(audioObjs) ? audioObjs : [audioObjs];
            if (!audioObjs) {
                return false;
            }
            var html = [];
            console.log(audioObjs)
            for (var i = 0; i < audioObjs.length; i++) {
                var src = createAudioHtml(audioObjs[i].key, audioObjs[i].url, audioObjs[i].title);
                html.push(src);
            }
            me.execCommand("inserthtml", html.join(""), true);
            // 初始化音频控件
            //initAudio(audioObjs);
            me.focus();
        }
    };

    /**
     * 构造音频控件html
     *
     * @param {string} audioDivId - 音频控件父div的id
     * @param {string} audioSrc - 音频控件地址
     * @param {string} audioTitle - 音频标题
     */
    function createAudioHtml(audioDivId, audioSrc, audioTitle) {
        //debugger
        var src = '<p class="edui-audio"><audio src="' + audioSrc + '" controls></audio><span style="display:none;">auido</span></p>';
        // var src = '<div class="audio-wrapper" id="' + audioDivId + '" style="background-color: #fcfcfc;margin: 10px auto;max-width: 670px;height: 90px;border: 1px solid #e0e0e0;">'
        //     + '<audio><source src="' + audioSrc + '"></audio>'
        //     + '<div class="audio-left" style="float: left;text-align: center;width: 22%;height: 100%;">'
        //     + '<img src="' + playicon + '" class="playicon" style="width: 40px;position: relative;top: 25px;margin: 0;display: initial;cursor: pointer;"/>'
        //     + '<img src="' + pauseicon + '" class="pauseicon" style="width: 40px;position: relative;top: 25px;margin: 0;display: none;cursor: pointer;"/>'
        //     + '</div>'
        //     + '<div class="audio-right" style="margin-right: 5%;float: right;width: 73%;height: 100%;">'
        //     + '<p class="audio-title" style="max-width: 536px;font-size: 15px;height: 35%;margin: 8px 0;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' + audioTitle + '</p>'
        //     + '<div class="progress-bar-bg" style="background-color: #d9d9d9;position: relative;height: 2px;cursor: pointer;">'
        //     + '<span class="progressDot" style="content: \' \';width: 12px;height: 12px;border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;background-color: #06b4e9;position: absolute;left: 0;top: -5px;margin-left: 0px;cursor: pointer;"></span>'
        //     + '<div class="progressBar" style="background-color: #06b4e9;width: 0;height: 2px;"></div>'
        //     + '</div>'
        //     + '<div class="audio-time" style="overflow: hidden;margin-top: -1px;">'
        //     + '<span class="audioCurTime" style="float: left;margin-top:10px;font-size: 12px;color: #969696">00:00</span><span class="audioTotalTime" style="float: right;margin-top:10px;font-size: 12px;color: #969696">00:00</span>'
        //     + '</div>'
        //     + '</div>'
        //     + '</div><br/>';
        return src;
    }

    /**
     * 初始化音频控件
     *
     * @param {array} audioObjs - 音频父div数组
     */
    function initAudio(audioObjs) {
        if (audioObjs) {
            for (var i = 0; i < audioObjs.length; i++) {
                var audioDiv = me.document.getElementById(audioObjs[i].key);
                initAudioEvent(audioDiv);
            }
        }
    }

    /**
     * 初始化音频控制事件
     *
     * @param {object} audioDiv - 音频父div
     */
    function initAudioEvent(audioDiv) {
        // div子节点
        var divArr = domUtils.getElementsByTagName(audioDiv, 'div');
        // audio控件
        var audio = domUtils.getElementsByTagName(audioDiv, 'audio')[0];
        // 控制音频文件名显示宽度
        var audioRight = domUtils.filterNodeList(divArr, function (node) {
            return node.className === 'audio-right';
        });
        var title = domUtils.getElementsByTagName(audioRight, 'p')[0];
        domUtils.setStyle(title, 'max-width', domUtils.getComputedStyle(audioRight, 'width'));

        // 右侧div组
        var rightDivArr = domUtils.getElementsByTagName(audioRight, 'div');
        // 进度条div
        var progressDiv = domUtils.filterNodeList(rightDivArr, function (node) {
            return node.className === 'progress-bar-bg';
        });
        // 已播放进度条
        var progressBar = domUtils.getElementsByTagName(progressDiv, 'div')[0];
        domUtils.setStyle(progressBar, 'width', 0); // 初始化为未播放状态
        // 进度条上控制点
        var progressDot = domUtils.getElementsByTagName(progressDiv, 'span')[0];
        domUtils.setStyle(progressDot, 'left', 0);  // 初始化为未播放状态
        // 时间div
        var timeDiv = domUtils.filterNodeList(rightDivArr, function (node) {
            return node.className === 'audio-time';
        });
        // 时间span组
        var timeSpanArr = domUtils.getElementsByTagName(timeDiv, 'span');
        // 已播放时间
        var audioCurTime = domUtils.filterNodeList(timeSpanArr, function (node) {
            return node.className === 'audioCurTime';
        });
        audioCurTime.innerHTML = '00:00';   // 初始化为0
        // 总时间
        var audioTotalTime = domUtils.filterNodeList(timeSpanArr, function (node) {
            return node.className === 'audioTotalTime';
        });

        // 点击播放/暂停图片时，控制音乐的播放与暂停
        var playerDiv = domUtils.filterNodeList(divArr, function (node) {
            return node.className === 'audio-left';
        });
        // 播放图标、暂停图标
        var playerImgs = domUtils.getElementsByTagName(playerDiv, 'img');
        var playImg = domUtils.filterNodeList(playerImgs, function (node) {
            return node.className === 'playicon';
        });
        var pauseImg = domUtils.filterNodeList(playerImgs, function (node) {
            return node.className === 'pauseicon';
        });
        // 初始化播放图标
        domUtils.setStyle(playImg, 'display', 'initial');
        domUtils.setStyle(pauseImg, 'display', 'none');

        // 音频准备就绪后执行
        audio.addEventListener('canplay', function () {
            audioTotalTime.innerHTML = transTime(audio.duration);   // 初始化为音频总时长
        });

        // 播放事件
        domUtils.on(playImg, 'click', function (e) {
            // 禁止事件冒泡
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }

            // 监听音频播放时间并更新进度条
            audio.addEventListener('timeupdate', function () {
                updateProgress(audio, progressBar, progressDot, audioCurTime);
            }, false);

            // 监听播放完成事件
            audio.addEventListener('ended', function () {
                audioEnded(progressBar, progressDot,
                    audioCurTime, playImg, pauseImg)
            }, false);
            // 播放
            audio.play();
            // 切换播放暂停图标
            domUtils.setStyle(playImg, 'display', 'none');
            domUtils.setStyle(pauseImg, 'display', 'initial');
            // 暂停其他正在播放的音频
            var audios = me.document.getElementsByTagName('audio');
            for (var i = 0; i < audios.length; i++) {
                var parentDiv = domUtils.findParent(audios[i], function (node) {
                    return node.className === 'audio-wrapper';
                });
                if (parentDiv.id != audioDiv.id && !audios[i].paused) {
                    audios[i].pause();
                    var playerDiv = domUtils.getNextDomNode(audios[i]);
                    var players = domUtils.getElementsByTagName(playerDiv, 'img');
                    var play = domUtils.filterNodeList(players, function (node) {
                        return node.className === 'playicon';
                    });
                    var pause = domUtils.filterNodeList(players, function (node) {
                        return node.className === 'pauseicon';
                    });
                    domUtils.setStyle(play, 'display', 'initial');
                    domUtils.setStyle(pause, 'display', 'none');
                }
            }
        });

        // 暂停事件
        domUtils.on(pauseImg, 'click', function (e) {
            // 禁止事件冒泡
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
            // 暂停
            audio.pause();
            // 切换播放暂停图标
            domUtils.setStyle(playImg, 'display', 'initial');
            domUtils.setStyle(pauseImg, 'display', 'none');
        });

        // 点击进度条跳到指定点播放
        domUtils.on(progressDiv, 'mousedown', function (e) {
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            if (!audio.paused || audio.currentTime != 0) {
                var pgsWidth = parseInt(domUtils.getComputedStyle(progressDiv, 'width'));
                var rate = e.offsetX / pgsWidth;
                audio.currentTime = audio.duration * rate;
                updateProgress(audio, progressBar, progressDot, audioCurTime);
            }
        });

        // 鼠标拖动进度点时可以调节进度
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        // 鼠标按下时
        domUtils.on(progressDot, 'mousedown', function (e) {
            if (!audio.paused || audio.currentTime != 0) {
                var oriLeft = progressDot.offsetLeft;
                var mouseX = e.clientX;
                var maxLeft = oriLeft; // 向左最大可拖动距离
                var maxRight = progressDiv.offsetWidth - oriLeft; // 向右最大可拖动距离

                // 禁止默认的选中事件（避免鼠标拖拽进度点的时候选中文字）
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                // 禁止事件冒泡
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }
                // 开始拖动
                me.document.onmousemove = function (e) {
                    var length = e.clientX - mouseX;
                    if (length > maxRight) {
                        length = maxRight;
                    } else if (length < -maxLeft) {
                        length = -maxLeft;
                    }
                    var pgsWidth = parseInt(domUtils.getComputedStyle(progressDiv, 'width'));
                    var rate = (oriLeft + length) / pgsWidth;
                    audio.currentTime = audio.duration * rate;
                    updateProgress(audio, progressBar, progressDot, audioCurTime);
                };
                // 拖动结束
                me.document.onmouseup = function () {
                    me.document.onmousemove = null;
                    me.document.onmouseup = null;
                };
            }
        });
    }

    /**
     * 更新进度条与当前播放时间
     *
     * @param {object} audio - audio对象
     * @param {object} progressBar - 进度条对象
     * @param {object} progressDot - 进度条控制点对象
     * @param {object} audioCurTime - 当前播放时间对象
     */
    function updateProgress(audio, progressBar, progressDot, audioCurTime) {
        var value = audio.currentTime / audio.duration;
        domUtils.setStyle(progressBar, 'width', value * 100 + '%');
        domUtils.setStyle(progressDot, 'left', value * 100 + '%');
        audioCurTime.innerHTML = transTime(audio.currentTime);
    }

    /**
     * 播放完成时把进度调回开始的位置
     *
     * @param {object} progressBar - 进度条对象
     * @param {object} progressDot - 进度条控制点对象
     * @param {object} audioCurTime - 当前播放时间对象
         * @param {object} playImg- 播放按钮图标
         * @param {object} pauseImg- 暂停按钮图标
     */
    function audioEnded(progressBar, progressDot, audioCurTime, playImg, pauseImg) {
        domUtils.setStyle(progressBar, 'width', 0);
        domUtils.setStyle(progressDot, 'left', 0);
        domUtils.setStyle(playImg, 'display', 'initial');
        domUtils.setStyle(pauseImg, 'display', 'none');
        audioCurTime.innerHTML = '00:00';
    }

    /**
     * 音频播放时间换算
     *
     * @param {number} value - 音频当前播放时间，单位秒
     */
    function transTime(value) {
        var time = "";
        var h = parseInt(value / 3600);
        value %= 3600;
        var m = parseInt(value / 60);
        var s = parseInt(value % 60);
        if (h > 0) {
            time = formatTime(h + ":" + m + ":" + s);
        } else {
            time = formatTime(m + ":" + s);
        }

        return time;
    }

    /**
     * 格式化时间显示，补零对齐
     *
     * eg：2:4  -->  02:04
     * @param {string} value - 形如 h:m:s 的字符串
     */
    function formatTime(value) {
        var time = "";
        var s = value.split(':');
        var i = 0;
        for (; i < s.length - 1; i++) {
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
            time += ":";
        }
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];

        return time;
    }
};
