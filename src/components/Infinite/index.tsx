import * as React from 'react';
import { imagePath } from './setting';

import './index.css';

interface IProps {
  name: string;
}

interface obj {
  val: number;
  ref: React.RefObject<HTMLImageElement>
}

interface IState {
  Lists: Array<obj>;
  // refs: Array<any>;
}

const io: IntersectionObserver = new IntersectionObserver((entries, self) => {
  entries.forEach((item) => {
    if (item.isIntersecting) {
      preLoadImage(item.target as HTMLImageElement);
      // 解除观察
      self.unobserve(item.target);
    }
  })
}, {
  threshold: [0.6]
})

function preLoadImage(img: HTMLImageElement): void {
  const src: string | undefined = img.dataset.src;
  
  if (!src) return;
  img.src = src;
}

class Infinite extends React.Component<IProps, IState> {
  readonly state: Readonly<IState> = {
    Lists: [{val: 1, ref: React.createRef<HTMLImageElement>()}]
  }

  public componentDidMount(): void {
    window.addEventListener<"scroll">('scroll', () => {
      const scroolTop: number = document.documentElement.scrollTop;
      const scroolHeight: number = document.documentElement.scrollHeight;
      const clientH: number = document.documentElement.clientHeight;

      if (scroolTop + clientH == scroolHeight) {
        fetch('http://localhost:8080/queryCount', {
          body: JSON.stringify({
            count: this.state.Lists.length + 1
          }),
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          }
        })
        .then((response) => {
          return response.json();
        })
        .then(res => {
          const success:boolean = res.success;
          
          if (!success) {
            console.log(res.errMsg);
          } else {
            this.insertTo();
          }
        })
      }
    });
  }

  public componentDidUpdate(): void {
    this.loadImage();
  }

  private insertTo(): void {
    const { Lists } = this.state;
    const item = {
      val: Lists.length + 1,
      ref: React.createRef<HTMLImageElement>()
    }

    this.setState({
      Lists: [...Lists, item]
    });
  }

  private loadImage:() => void = () => {
    const { Lists } = this.state;

    Lists.forEach(item => {
      io.observe(item.ref.current as Element);
    })
  }

  public render(): React.ReactNode {
    const { name } = this.props;
    const { Lists } = this.state;
  
    return (
      <React.Fragment>
        {Lists.map(e => {

          return (
            <div key={e.val} className='peek'>
              <h2>{`这是第${e.val}页`}</h2>
              &copy;「{name}」
              <img
              ref={e.ref}
              width="150"
              height="200"
              data-src={imagePath}
              />
            </div>
          )})
        }
        <img src='' onError={this.loadImage}/>
      </React.Fragment>
    )
  }
}

export default Infinite;
