let data =  [
      {
        "_id": "19762d645eac3e31003db3b360f58435",
        "createTime": "2020-05-01 23:20:17",
        "createUser": "ouhWq5aSaTSp2LFNQgsowmvLXIlE",
        "no": "vv",
        "time": "2020-06-01 23:16:00"
      },
      {
        "_id": "f10018335eac3e39003ae78606efef11",
        "category": "感冒",
        "createTime": "2020-05-01 23:20:25",
        "createUser": "ouhWq5aSaTSp2LFNQgsowmvLXIlE",
        "department": [
          "理学院",
          "应用物理"
        ],
        "no": "vv61",
        "office": "内科",
        "status": 1,
        "time": "2020-06-01 23:16:00"
      },
      {
        "_id": "fddd30c55ead17ab003f7da55c70d12e",
        "createTime": "2020-05-02 14:48:11",
        "createUser": "ouhWq5aSaTSp2LFNQgsowmvLXIlE",
        "name": "yy",
        "no": "yy",
        "time": "2020-06-01 23:08:00",
        "status": 1
      }
    ]
  

    const newTime = new Date().valueOf()
  
    // 0 未开始
    // 1 有效时间
    // -1 失效
    data.forEach(it => {
      it.time = new Date(it.time).valueOf()
      if (newTime - it.time > 1800000) {
        it.status = -1
      } else if (newTime - it.time < 1800000 && newTime > it.time){
        it.status = 0
      } else {
        it.status = 1
      }
      // 区间重叠算法
      // 1、Begin = Max(A1, B1);
      // 2、End = Min(A2, B2);
      // 3、Len = End - Begin
      const startTime = it.time
      const endTime = it.time + 1800000
      data.forEach(s => {
          if (s._id !== it._id) {
            s.time = new Date(s.time).valueOf()
          const sTime = s.time
          const eTime = s.time + 1800000
          const Begin = Math.max(startTime, sTime)
          const End = Math.min(endTime, eTime)
          if (End - Begin > 0) {
            it.countActivate = it.countActivate ? it.countActivate + 1 : 1
          }
          }
      })
    })
    
    console.log('data :>> ', data);
