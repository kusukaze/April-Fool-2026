// 题库
const questions = [
    {
        question: "香澄は有咲をバンドに誘う。しかし、学年一の秀才でありながら、学校もサボりがちなインドア派の有咲の態度は_____。",
        options: ["あどけない", "そっけない", "おっかない", "半端ない"],
        answer: 1
    },
    {
        question: "今日",
        options: ["けふ", "けう", "きやふ", "きやう"],
        answer: 0
    },
    {
        question: "敵は_____にあり",
        options: ["吉祥寺", "西行寺", "花月総持寺", "本能寺"],
        answer: 3
    },
    {
        question: "世の中に、_____ _____ __★__ _____、春の心はのどけからまし。",
        options: ["せば", "絶えて", "なかり", "桜の花"],
        answer: 2
    }
];

while(questions.length < 30) {
    questions.push({
    question: questions.length,
    options:[1,2,3,4],
    answer:0
    });
}